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
    const { default: prisma } = await import('../src/server/utils/prisma.js');
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const id = url.pathname.split('/').pop();

    // GET /api/team-members - List all public team members
    if (req.method === 'GET' && (url.pathname === '/api/team-members' || url.pathname === '/team-members')) {
      const members = await prisma.teamMember.findMany({
        where: { isPublic: true },
        orderBy: { createdAt: 'asc' }
      });
      res.statusCode = 200;
      return res.end(JSON.stringify(members));
    }

    // GET /api/team-members/:id - Get specific team member
    if (req.method === 'GET' && id && id !== 'team-members') {
      const member = await prisma.teamMember.findUnique({
        where: { id }
      });
      
      if (!member || !member.isPublic) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Team member not found' }));
      }
      
      res.statusCode = 200;
      return res.end(JSON.stringify(member));
    }

    // POST /api/team-members - Create new team member (admin only)
    if (req.method === 'POST') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const body = JSON.parse(Buffer.concat(chunks).toString());
      
      const member = await prisma.teamMember.create({
        data: body
      });
      
      res.statusCode = 201;
      return res.end(JSON.stringify(member));
    }

    // PUT /api/team-members/:id - Update team member (admin only)
    if (req.method === 'PUT' && id && id !== 'team-members') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const body = JSON.parse(Buffer.concat(chunks).toString());
      
      const member = await prisma.teamMember.update({
        where: { id },
        data: body
      });
      
      res.statusCode = 200;
      return res.end(JSON.stringify(member));
    }

    // DELETE /api/team-members/:id - Delete team member (admin only)
    if (req.method === 'DELETE' && id && id !== 'team-members') {
      await prisma.teamMember.delete({
        where: { id }
      });
      
      res.statusCode = 204;
      return res.end();
    }

    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  } catch (error) {
    console.error('Error handling team members:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Failed to handle team members' }));
  }
}