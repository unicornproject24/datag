import type { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  try {
    const { default: prisma } = await import('./prisma.js');
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop();

    // GET /api/research-projects - List all public research projects
    if (req.method === 'GET' && (url.pathname === '/api/research-projects' || url.pathname === '/research-projects')) {
      const projects = await prisma.researchProject.findMany({
        where: { isPublic: true },
        orderBy: { createdAt: 'desc' }
      });
      res.statusCode = 200;
      return res.end(JSON.stringify(projects));
    }

    // GET /api/research-projects/:id - Get specific research project
    if (req.method === 'GET' && id && id !== 'research-projects') {
      const project = await prisma.researchProject.findUnique({
        where: { id }
      });
      
      if (!project || !project.isPublic) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Research project not found' }));
      }
      
      res.statusCode = 200;
      return res.end(JSON.stringify(project));
    }

    // POST /api/research-projects - Create new research project (admin only)
    if (req.method === 'POST') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const body = JSON.parse(Buffer.concat(chunks).toString());
      
      const project = await prisma.researchProject.create({
        data: body
      });
      
      res.statusCode = 201;
      return res.end(JSON.stringify(project));
    }

    // PUT /api/research-projects/:id - Update research project (admin only)
    if (req.method === 'PUT' && id && id !== 'research-projects') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const body = JSON.parse(Buffer.concat(chunks).toString());
      
      const project = await prisma.researchProject.update({
        where: { id },
        data: body
      });
      
      res.statusCode = 200;
      return res.end(JSON.stringify(project));
    }

    // DELETE /api/research-projects/:id - Delete research project (admin only)
    if (req.method === 'DELETE' && id && id !== 'research-projects') {
      await prisma.researchProject.delete({
        where: { id }
      });
      
      res.statusCode = 204;
      return res.end();
    }

    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  } catch (error) {
    console.error('Error handling research projects:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Failed to handle research projects' }));
  }
}