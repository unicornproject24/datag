import type { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import * as bcrypt from 'bcryptjs';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  try {
    const { default: prisma } = await import('../src/server/utils/prisma.js');
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const action = url.pathname.split('/').pop();

    // POST /api/auth/login
    if (req.method === 'POST' && action === 'login') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const { email, password } = JSON.parse(Buffer.concat(chunks).toString());

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ error: 'Invalid credentials' }));
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ error: 'Invalid credentials' }));
      }

      res.statusCode = 200;
      return res.end(JSON.stringify({
        token: user.id,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }));
    }

    // POST /api/auth/register
    if (req.method === 'POST' && action === 'register') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const { email, password, name } = JSON.parse(Buffer.concat(chunks).toString());

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ error: 'User already exists' }));
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name
        }
      });

      res.statusCode = 201;
      return res.end(JSON.stringify({
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }));
    }

    // POST /api/auth/verify
    if (req.method === 'POST' && action === 'verify') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const { token } = JSON.parse(Buffer.concat(chunks).toString());

      try {
        const user = await prisma.user.findUnique({
          where: { id: token },
          select: { id: true, email: true, name: true, role: true }
        });

        if (!user) {
          res.statusCode = 401;
          return res.end(JSON.stringify({ error: 'Invalid token' }));
        }

        res.statusCode = 200;
        return res.end(JSON.stringify({ user }));
      } catch (error) {
        res.statusCode = 401;
        return res.end(JSON.stringify({ error: 'Invalid token' }));
      }
    }

    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  } catch (error) {
    console.error('Auth error:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Authentication failed' }));
  }
}