import * as bcrypt from 'bcryptjs';
import prisma from '../utils/prisma.js';
import { User } from '@prisma/client';

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

    // Return simple token (user ID for now)
    return {
      token: user.id,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      }
    };
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

    // Only allow ADMIN and TEAM_MEMBER roles to access admin panel
    if (user.role !== 'ADMIN' && user.role !== 'TEAM_MEMBER') {
      throw new Error('Insufficient permissions. Only admins and team members can access this area.');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Return simple token (user ID for now)
    return {
      token: user.id,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status
      }
    };
  }

  static async verifyToken(token: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: token }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}