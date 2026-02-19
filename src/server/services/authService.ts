import { sign, verify, SignOptions } from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';
import { User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export class AuthService {
  static async register(userData: {
    email: string;
    password: string;
    name: string;
    researchInterests?: string[];
  }) {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        researchInterests: userData.researchInterests || [],
        role: 'VISITOR',
        status: 'PENDING' // New users require approval
      }
    });

    return this.generateTokens(user);
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.status !== 'APPROVED') {
      throw new Error('Account not approved');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last login - removing this line since lastLogin field doesn't exist in schema
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: { lastLogin: new Date() }
    // });

    return this.generateTokens(user);
  }

  static async verifyToken(token: string) {
    try {
      const decoded = verify(token, JWT_SECRET) as { id: string; email: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static generateTokens(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    };

    const accessToken = sign(payload, JWT_SECRET as string, {
      expiresIn: JWT_EXPIRES_IN
    } as SignOptions);

    const refreshToken = sign(
      { id: user.id },
      REFRESH_TOKEN_SECRET as string,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' } as SignOptions
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      }
    };
  }

  static async refreshAccessToken(refreshToken: string) {
    try {
      const payload = verify(
        refreshToken,
        REFRESH_TOKEN_SECRET
      ) as { id: string };

      const user = await prisma.user.findUnique({
        where: { id: payload.id }
      });

      if (!user) {
        throw new Error('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}