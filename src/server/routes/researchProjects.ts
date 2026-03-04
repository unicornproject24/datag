import express from 'express';
import prisma from '../utils/prisma';

const router = express.Router();

// Get all research projects
router.get('/', async (req, res) => {
  try {
    console.log('Fetching research projects...');
    const researchProjects = await prisma.researchProject.findMany({
      where: {
        isPublic: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log(`Found ${researchProjects.length} research projects`);
    res.json(researchProjects);
  } catch (error) {
    console.error('Error fetching research projects:', error);
    console.error('Error details:', JSON.stringify(error));
    res.status(500).json({ 
      error: 'Failed to fetch research projects',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get a specific research project
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const researchProject = await prisma.researchProject.findUnique({
      where: { id }
    });

    if (!researchProject) {
      return res.status(404).json({ error: 'Research project not found' });
    }

    res.json(researchProject);
  } catch (error) {
    console.error('Error fetching research project:', error);
    res.status(500).json({ error: 'Failed to fetch research project' });
  }
});

// Create a new research project
router.post('/', async (req, res) => {
  try {
    const { title, description, status, tags, imageUrl } = req.body;
    
    const researchProject = await prisma.researchProject.create({
      data: {
        title,
        description,
        status,
        tags: tags || [],
        imageUrl
      }
    });

    res.status(201).json(researchProject);
  } catch (error) {
    console.error('Error creating research project:', error);
    res.status(500).json({ error: 'Failed to create research project' });
  }
});

// Update a research project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, tags, imageUrl } = req.body;

    const researchProject = await prisma.researchProject.update({
      where: { id },
      data: {
        title,
        description,
        status,
        tags: tags || [],
        imageUrl
      }
    });

    res.json(researchProject);
  } catch (error) {
    console.error('Error updating research project:', error);
    res.status(500).json({ error: 'Failed to update research project' });
  }
});

// Delete a research project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.researchProject.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting research project:', error);
    res.status(500).json({ error: 'Failed to delete research project' });
  }
});

export default router;