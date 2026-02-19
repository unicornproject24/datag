import type { IncomingMessage, ServerResponse } from 'http';

function getIdFromPath(url: string): string | null {
  const match = url.match(/\/blog-posts\/([^\/\?]+)/);
  return match ? match[1] : null;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  const id = getIdFromPath(req.url || '');
  if (!id) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'ID is required' }));
  }

  try {
    const { default: prisma } = await import('../../src/server/utils/prisma.js');
    const post = await prisma.blogPost.findFirst({
      where: { id, isPublic: true }
    });

    if (!post) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ error: 'Blog post not found' }));
    }

    res.statusCode = 200;
    return res.end(JSON.stringify(post));
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Failed to fetch blog post' }));
  }
}
