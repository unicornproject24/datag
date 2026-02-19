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
  const match = url.match(/\/blog-posts\/admin\/([^\/\?]+)/);
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

  const { default: prisma } = await import('../../../src/server/utils/prisma.js');
  const id = getIdFromPath(req.url || '');

  if (!id) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'ID is required' }));
  }

  // GET /api/blog-posts/admin/:id
  if (req.method === 'GET') {
    try {
      const post = await prisma.blogPost.findUnique({ where: { id } });
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

  // PUT /api/blog-posts/admin/:id
  if (req.method === 'PUT') {
    try {
      const body = await parseBody(req);
      const { title, excerpt, content, author, authorImage, category, tags, imageUrl, readTime, isPublic } = body;

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (excerpt !== undefined) updateData.excerpt = excerpt;
      if (content !== undefined) updateData.content = content;
      if (author !== undefined) updateData.author = author;
      if (authorImage !== undefined) updateData.authorImage = authorImage;
      if (category !== undefined) updateData.category = category;
      if (tags !== undefined) updateData.tags = tags;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (readTime !== undefined) updateData.readTime = readTime;
      if (isPublic !== undefined) {
        updateData.isPublic = isPublic;
        if (isPublic) updateData.publishedAt = new Date();
      }

      const post = await prisma.blogPost.update({
        where: { id },
        data: updateData
      });

      res.statusCode = 200;
      return res.end(JSON.stringify(post));
    } catch (error) {
      console.error('Error updating blog post:', error);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: 'Failed to update blog post' }));
    }
  }

  // DELETE /api/blog-posts/admin/:id
  if (req.method === 'DELETE') {
    try {
      await prisma.blogPost.delete({ where: { id } });
      res.statusCode = 200;
      return res.end(JSON.stringify({ success: true }));
    } catch (error) {
      console.error('Error deleting blog post:', error);
      res.statusCode = 500;
      return res.end(JSON.stringify({ error: 'Failed to delete blog post' }));
    }
  }

  res.statusCode = 405;
  return res.end(JSON.stringify({ error: 'Method not allowed' }));
}
