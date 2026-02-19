import type { IncomingMessage, ServerResponse } from 'http';

function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function getIdFromPath(url: string): string | null {
  const match = url.match(/\/users\/([^\/\?]+)/);
  return match ? match[1] : null;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const { default: prisma } = await import('../../src/server/utils/prisma.js');
  const id = getIdFromPath(req.url || '');

  if (!id) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'ID is required' }));
  }

  // GET /api/users/:id
  if (req.method === 'GET') {
    try {
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
    } catch (error) {
      console.error('Error fetching user:', error);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: 'Failed to fetch user' }));
    }
  }

  // PUT /api/users/:id
  if (req.method === 'PUT') {
    try {
      const body = await parseBody(req);
      const { status, role } = body;

      const updateData: any = {};
      if (status) updateData.status = status;
      if (role) updateData.role = role;

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
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
      return res.end(JSON.stringify(user));
    } catch (error) {
      console.error('Error updating user:', error);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: 'Failed to update user' }));
    }
  }

  // DELETE /api/users/:id
  if (req.method === 'DELETE') {
    try {
      await prisma.user.delete({ where: { id } });
      res.statusCode = 200;
      return res.end(JSON.stringify({ success: true }));
    } catch (error) {
      console.error('Error deleting user:', error);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: 'Failed to delete user' }));
    }
  }

  res.statusCode = 405;
  return res.end(JSON.stringify({ error: 'Method not allowed' }));
}
