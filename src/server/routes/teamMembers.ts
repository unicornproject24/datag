import express from 'express';
import prisma from '../utils/prisma';

const router = express.Router();

// Get all team members
router.get('/', async (req, res) => {
  try {
    const teamMembers = await prisma.teamMember.findMany();
    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Get a specific team member
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const teamMember = await prisma.teamMember.findUnique({
      where: { id }
    });

    if (!teamMember) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json(teamMember);
  } catch (error) {
    console.error('Error fetching team member:', error);
    res.status(500).json({ error: 'Failed to fetch team member' });
  }
});

// Create a new team member
router.post('/', async (req, res) => {
  try {
    const { name, role, bio, expertise, imageUrl } = req.body;
    
    const teamMember = await prisma.teamMember.create({
      data: {
        name,
        role,
        bio,
        expertise: expertise || [],
        imageUrl
      }
    });

    res.status(201).json(teamMember);
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

// Update a team member
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, bio, expertise, imageUrl } = req.body;

    const teamMember = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        role,
        bio,
        expertise: expertise || [],
        imageUrl
      }
    });

    res.json(teamMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

// Delete a team member
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.teamMember.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

export default router;