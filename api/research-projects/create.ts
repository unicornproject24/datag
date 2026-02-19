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
    const { title, description, status, tags, imageUrl, isPublic } = body;

    if (!title || !description) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: 'Title and description are required' }));
    }

    const { default: prisma } = await import('../../src/server/utils/prisma.js');
    const project = await prisma.researchProject.create({
      data: {
        title,
        description,
        status: status || 'Active',
        tags: tags || [],
        imageUrl: imageUrl || '',
        isPublic: isPublic || false
      }
    });

    res.statusCode = 201;
    return res.end(JSON.stringify(project));
  } catch (error) {
    console.error('Error creating research project:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Failed to create research project' }));
  }
}
