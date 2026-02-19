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
  const match = url.match(/\/team-members\/([^\/\?]+)/);
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

  // GET /api/team-members/:id
  if (req.method === 'GET') {
    try {
      const member = await prisma.teamMember.findUnique({ where: { id } });
      if (!member) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Team member not found' }));
      }
      res.statusCode = 200;
      return res.end(JSON.stringify(member));
    } catch (error) {
      console.error('Error fetching team member:', error);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: 'Failed to fetch team member' }));
    }
  }

  // PUT /api/team-members/:id
  if (req.method === 'PUT') {
    try {
      const body = await parseBody(req);
      const { name, role, bio, expertise, imageUrl, isPublic } = body;

      const member = await prisma.teamMember.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(role && { role }),
          ...(bio && { bio }),
          ...(expertise && { expertise }),
          ...(imageUrl !== undefined && { imageUrl }),
          ...(isPublic !== undefined && { isPublic })
        }
      });

      res.statusCode = 200;
      return res.end(JSON.stringify(member));
    } catch (error) {
      console.error('Error updating team member:', error);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: 'Failed to update team member' }));
    }
  }

  // DELETE /api/team-members/:id
  if (req.method === 'DELETE') {
    try {
      await prisma.teamMember.delete({ where: { id } });
      res.statusCode = 200;
      return res.end(JSON.stringify({ success: true }));
    } catch (error) {
      console.error('Error deleting team member:', error);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: 'Failed to delete team member' }));
    }
  }

  res.statusCode = 405;
  return res.end(JSON.stringify({ error: 'Method not allowed' }));
}
