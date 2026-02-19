import express from 'express';
import { AuthService } from '../services/authService.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, researchInterests } = req.body;

    // Basic validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const result = await AuthService.register({
      email,
      password,
      name,
      researchInterests
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await AuthService.login(email, password);

    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: error instanceof Error ? error.message : 'Invalid credentials' });
  }
});

// Verify token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    const user = await AuthService.verifyToken(token);
    res.json({ user });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;