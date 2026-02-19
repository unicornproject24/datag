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

    // GET /api/blog-posts - List all public blog posts
    if (req.method === 'GET' && url.pathname === '/api/blog-posts') {
      const posts = await prisma.blogPost.findMany({
        where: { isPublic: true },
        orderBy: { publishedAt: 'desc' }
      });
      res.statusCode = 200;
      return res.end(JSON.stringify(posts));
    }

    // GET /api/blog-posts/:id - Get specific blog post
    if (req.method === 'GET' && id && id !== 'blog-posts') {
      const post = await prisma.blogPost.findUnique({
        where: { id }
      });
      
      if (!post || !post.isPublic) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: 'Blog post not found' }));
      }
      
      res.statusCode = 200;
      return res.end(JSON.stringify(post));
    }

    // POST /api/blog-posts - Create new blog post (admin only)
    if (req.method === 'POST') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const body = JSON.parse(Buffer.concat(chunks).toString());
      
      const post = await prisma.blogPost.create({
        data: body
      });
      
      res.statusCode = 201;
      return res.end(JSON.stringify(post));
    }

    // PUT /api/blog-posts/:id - Update blog post (admin only)
    if (req.method === 'PUT' && id && id !== 'blog-posts') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const body = JSON.parse(Buffer.concat(chunks).toString());
      
      const post = await prisma.blogPost.update({
        where: { id },
        data: body
      });
      
      res.statusCode = 200;
      return res.end(JSON.stringify(post));
    }

    // DELETE /api/blog-posts/:id - Delete blog post (admin only)
    if (req.method === 'DELETE' && id && id !== 'blog-posts') {
      await prisma.blogPost.delete({
        where: { id }
      });
      
      res.statusCode = 204;
      return res.end();
    }

    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  } catch (error) {
    console.error('Error handling blog posts:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Failed to handle blog posts' }));
  }
}