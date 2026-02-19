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

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  try {
    const body = await parseBody(req);
    const { name, role, bio, expertise, imageUrl, isPublic } = body;

    if (!name || !role) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'Name and role are required' }));
    }

    const { default: prisma } = await import('../../src/server/utils/prisma.js');
    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        bio: bio || '',
        expertise: expertise || [],
        imageUrl: imageUrl || '',
        isPublic: isPublic ?? true
      }
    });

    res.statusCode = 201;
    return res.end(JSON.stringify(member));
  } catch (error) {
    console.error('Error creating team member:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Failed to create team member' }));
  }
}
