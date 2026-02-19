import express from 'express';
import prisma from '../utils/prisma';

const router = express.Router();

// Get all partners
router.get('/', async (req, res) => {
  try {
    const partners = await prisma.partner.findMany();
    res.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ error: 'Failed to fetch partners' });
  }
});

// Get a specific partner
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const partner = await prisma.partner.findUnique({
      where: { id }
    });

    if (!partner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    res.json(partner);
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ error: 'Failed to fetch partner' });
  }
});

// Create a new partner
router.post('/', async (req, res) => {
  try {
    const { name, type, description } = req.body;
    
    const partner = await prisma.partner.create({
      data: {
        name,
        type,
        description
      }
    });

    res.status(201).json(partner);
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ error: 'Failed to create partner' });
  }
});

// Update a partner
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, description } = req.body;

    const partner = await prisma.partner.update({
      where: { id },
      data: {
        name,
        type,
        description
      }
    });

    res.json(partner);
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ error: 'Failed to update partner' });
  }
});

// Delete a partner
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.partner.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ error: 'Failed to delete partner' });
  }
});

export default router;