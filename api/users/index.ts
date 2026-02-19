import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  try {
    const { default: prisma } = await import('../../src/server/utils/prisma.js');
    const users = await prisma.user.findMany({
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
    res.statusCode = 200;
    return res.end(JSON.stringify(users));
  } catch (error) {
    console.error('Error fetching users:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Failed to fetch users' }));
  }
}
