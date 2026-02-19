import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';
import teamMemberRoutes from './routes/teamMembers.js';
import blogPostRoutes from './routes/blogPosts.js';
import researchProjectRoutes from './routes/researchProjects.js';
import partnerRoutes from './routes/partners.js';
import userRoutes from './routes/users.js';
import initializeRoutes from './routes/initialize.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/team-members', teamMemberRoutes);
app.use('/api/blog-posts', blogPostRoutes);
app.use('/api/research-projects', researchProjectRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/users', userRoutes);
app.use('/api/initialize-data', initializeRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch-all for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;