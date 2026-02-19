import type { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  try {
    const { default: prisma } = await import('../src/server/utils/prisma.js');
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop();

    // GET /api/users - List all users (admin only)
    if (req.method === 'GET' && url.pathname === '/api/users') {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true
        }
      });
      res.statusCode = 200;
      return res.end(JSON.stringify(users));
    }

    // GET /api/users/:id - Get specific user (admin only)
    if (req.method === 'GET' && id && id !== 'users') {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          bio: true,
          researchInterests: true,
          photoUrl: true,
          isPublic: true,
          createdAt: true
        }
      });
      
      if (!user) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'User not found' }));
      }
      
      res.statusCode = 200;
      return res.end(JSON.stringify(user));
    }

    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  } catch (error) {
    console.error('Error handling users:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Failed to handle users' }));
  }
}