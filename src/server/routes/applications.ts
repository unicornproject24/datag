import express from 'express';
import { ApplicationService } from '../services/applicationService.js';

const router = express.Router();

// Submit a new application
router.post('/', async (req, res) => {
  try {
    const { email, name, motivation, cvUrl, researchInterests, expertise, githubUrl, linkedinUrl } = req.body;

    // Basic validation
    if (!email || !name || !motivation || !cvUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const application = await ApplicationService.submitApplication({
      email,
      name,
      motivation,
      cvUrl,
      researchInterests,
      expertise,
      githubUrl,
      linkedinUrl
    });

    res.status(201).json({ application });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Application creation failed' });
  }
});

// Get all applications (admin only)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    const applications = await ApplicationService.getAllApplications(
      status ? status as any : undefined
    );
    res.json({ applications });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to retrieve applications' });
  }
});

// Get a specific application
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const application = await ApplicationService.getApplication(id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ application });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to retrieve application' });
  }
});

// Update an application (admin only) - This would typically be for approving/rejecting
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;
    const reviewerId = 'temp-reviewer-id'; // This would come from authenticated user

    if (status === 'APPROVED') {
      const application = await ApplicationService.approveApplication(id, reviewerId);
      res.json({ application, message: 'Application approved successfully' });
    } else if (status === 'REJECTED') {
      const application = await ApplicationService.rejectApplication(id, reviewerId, feedback);
      res.json({ application, message: 'Application rejected successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid status. Use APPROVED or REJECTED' });
    }
  } catch (error) {
    console.error('Update application error:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Application update failed' });
  }
});

// Delete an application (admin only)
router.delete('/:id', async (req, res) => {
  try {
    // For now, we'll just return an error since there's no delete method in the service
    return res.status(404).json({ error: 'Delete application not implemented' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Application deletion failed' });
  }
});

export default router;