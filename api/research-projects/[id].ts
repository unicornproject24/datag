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
  const match = url.match(/\/research-projects\/([^\/\?]+)/);
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

  // GET /api/research-projects/:id
  if (req.method === 'GET') {
    try {
      const project = await prisma.researchProject.findUnique({ where: { id } });
      if (!project) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Research project not found' }));
      }
      res.statusCode = 200;
      return res.end(JSON.stringify(project));
    } catch (error) {
      console.error('Error fetching research project:', error);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: 'Failed to fetch research project' }));
    }
  }

  // PUT /api/research-projects/:id
  if (req.method === 'PUT') {
    try {
      const body = await parseBody(req);
      const { title, description, status, tags, imageUrl, isPublic } = body;

      const project = await prisma.researchProject.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(status && { status }),
          ...(tags && { tags }),
          ...(imageUrl !== undefined && { imageUrl }),
          ...(isPublic !== undefined && { isPublic })
        }
      });

      res.statusCode = 200;
      return res.end(JSON.stringify(project));
    } catch (error) {
      console.error('Error updating research project:', error);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: 'Failed to update research project' }));
    }
  }

  // DELETE /api/research-projects/:id
  if (req.method === 'DELETE') {
    try {
      await prisma.researchProject.delete({ where: { id } });
      res.statusCode = 200;
      return res.end(JSON.stringify({ success: true }));
    } catch (error) {
      console.error('Error deleting research project:', error);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: 'Failed to delete research project' }));
    }
  }

  res.statusCode = 405;
  return res.end(JSON.stringify({ error: 'Method not allowed' }));
}
