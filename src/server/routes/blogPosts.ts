import express from 'express';
import prisma from '../utils/prisma';

const router = express.Router();

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const blogPosts = await prisma.blogPost.findMany({
      orderBy: { date: 'desc' }
    });
    res.json(blogPosts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get a specific blog post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blogPost = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(blogPost);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Create a new blog post
router.post('/', async (req, res) => {
  try {
    const { title, excerpt, author, authorImage, date, readTime } = req.body;
    
    const blogPost = await prisma.blogPost.create({
      data: {
        title,
        excerpt,
        author,
        authorImage,
        date: new Date(date),
        readTime
      }
    });

    res.status(201).json(blogPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Update a blog post
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, author, authorImage, date, readTime } = req.body;

    const blogPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        excerpt,
        author,
        authorImage,
        date: new Date(date),
        readTime
      }
    });

    res.json(blogPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.blogPost.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

export default router;