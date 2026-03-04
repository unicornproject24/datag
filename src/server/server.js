import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory storage (in production, you'd use a real database)
let teamMembers = [];
let blogPosts = [];
let researchProjects = [];
let partners = [];

// Initialize with sample data if empty
if (teamMembers.length === 0) {
  teamMembers = [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      role: 'Principal Investigator',
      bio: 'Leading research in data ethics and digital wellbeing with 15+ years of experience.',
      expertise: ['Data Ethics', 'Privacy', 'AI Policy'],
      imageUrl: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '2',
      name: 'Dr. Marcus Johnson',
      role: 'Senior Researcher',
      bio: 'Specializes in quantitative methods for measuring digital wellbeing outcomes.',
      expertise: ['Statistics', 'Survey Design', 'Behavioral Analysis'],
      imageUrl: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];
  
  blogPosts = [
    {
      id: '1',
      title: 'Rethinking Data Privacy in the Age of AI',
      excerpt: 'Traditional privacy frameworks may not be sufficient for protecting individuals in AI-driven ecosystems. We explore new approaches to data governance.',
      author: 'Dr. Sarah Chen',
      authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: new Date('2025-10-25').toISOString(),
      readTime: '8 min read'
    }
  ];
  
  researchProjects = [
    {
      id: '1',
      title: 'Digital wellbeing Metrics Framework',
      description: 'Developing comprehensive metrics to assess individual and collective digital wellbeing across various platforms and contexts.',
      status: 'Active',
      tags: ['Metrics', 'Framework', 'wellbeing'],
      imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];
  
  partners = [
    {
      id: '1',
      name: 'Digital Health Institute',
      type: 'Academic Partner',
      description: 'Collaborative research on health data governance and ethical frameworks for medical AI systems.'
    }
  ];
}

// Routes for team members
app.get('/api/team-members', (req, res) => {
  res.json(teamMembers);
});

app.get('/api/team-members/:id', (req, res) => {
  const member = teamMembers.find(m => m.id === req.params.id);
  if (member) {
    res.json(member);
  } else {
    res.status(404).json({ error: 'Team member not found' });
  }
});

app.post('/api/team-members', (req, res) => {
  const newMember = { id: Date.now().toString(), ...req.body };
  teamMembers.push(newMember);
  res.status(201).json(newMember);
});

app.put('/api/team-members/:id', (req, res) => {
  const index = teamMembers.findIndex(m => m.id === req.params.id);
  if (index !== -1) {
    teamMembers[index] = { ...teamMembers[index], ...req.body };
    res.json(teamMembers[index]);
  } else {
    res.status(404).json({ error: 'Team member not found' });
  }
});

app.delete('/api/team-members/:id', (req, res) => {
  const initialLength = teamMembers.length;
  teamMembers = teamMembers.filter(m => m.id !== req.params.id);
  if (teamMembers.length < initialLength) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Team member not found' });
  }
});

// Routes for blog posts
app.get('/api/blog-posts', (req, res) => {
  res.json(blogPosts);
});

app.get('/api/blog-posts/:id', (req, res) => {
  const post = blogPosts.find(p => p.id === req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ error: 'Blog post not found' });
  }
});

app.post('/api/blog-posts', (req, res) => {
  const newPost = { id: Date.now().toString(), ...req.body };
  blogPosts.push(newPost);
  res.status(201).json(newPost);
});

app.put('/api/blog-posts/:id', (req, res) => {
  const index = blogPosts.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    blogPosts[index] = { ...blogPosts[index], ...req.body };
    res.json(blogPosts[index]);
  } else {
    res.status(404).json({ error: 'Blog post not found' });
  }
});

app.delete('/api/blog-posts/:id', (req, res) => {
  const initialLength = blogPosts.length;
  blogPosts = blogPosts.filter(p => p.id !== req.params.id);
  if (blogPosts.length < initialLength) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Blog post not found' });
  }
});

// Routes for research projects
app.get('/api/research-projects', (req, res) => {
  res.json(researchProjects);
});

app.get('/api/research-projects/:id', (req, res) => {
  const project = researchProjects.find(p => p.id === req.params.id);
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ error: 'Research project not found' });
  }
});

app.post('/api/research-projects', (req, res) => {
  const newProject = { id: Date.now().toString(), ...req.body };
  researchProjects.push(newProject);
  res.status(201).json(newProject);
});

app.put('/api/research-projects/:id', (req, res) => {
  const index = researchProjects.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    researchProjects[index] = { ...researchProjects[index], ...req.body };
    res.json(researchProjects[index]);
  } else {
    res.status(404).json({ error: 'Research project not found' });
  }
});

app.delete('/api/research-projects/:id', (req, res) => {
  const initialLength = researchProjects.length;
  researchProjects = researchProjects.filter(p => p.id !== req.params.id);
  if (researchProjects.length < initialLength) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Research project not found' });
  }
});

// Routes for partners
app.get('/api/partners', (req, res) => {
  res.json(partners);
});

app.get('/api/partners/:id', (req, res) => {
  const partner = partners.find(p => p.id === req.params.id);
  if (partner) {
    res.json(partner);
  } else {
    res.status(404).json({ error: 'Partner not found' });
  }
});

app.post('/api/partners', (req, res) => {
  const newPartner = { id: Date.now().toString(), ...req.body };
  partners.push(newPartner);
  res.status(201).json(newPartner);
});

app.put('/api/partners/:id', (req, res) => {
  const index = partners.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    partners[index] = { ...partners[index], ...req.body };
    res.json(partners[index]);
  } else {
    res.status(404).json({ error: 'Partner not found' });
  }
});

app.delete('/api/partners/:id', (req, res) => {
  const initialLength = partners.length;
  partners = partners.filter(p => p.id !== req.params.id);
  if (partners.length < initialLength) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Partner not found' });
  }
});

// Initialize data route
app.post('/api/initialize-data', (req, res) => {
  if (teamMembers.length > 0) {
    return res.json({ success: true, message: 'Data already initialized' });
  }

  // Initialize with default data
  teamMembers = [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      role: 'Principal Investigator',
      bio: 'Leading research in data ethics and digital wellbeing with 15+ years of experience.',
      expertise: ['Data Ethics', 'Privacy', 'AI Policy'],
      imageUrl: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '2',
      name: 'Dr. Marcus Johnson',
      role: 'Senior Researcher',
      bio: 'Specializes in quantitative methods for measuring digital wellbeing outcomes.',
      expertise: ['Statistics', 'Survey Design', 'Behavioral Analysis'],
      imageUrl: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '3',
      name: 'Dr. Priya Patel',
      role: 'Research Fellow',
      bio: 'Focuses on the intersection of data science and mental health.',
      expertise: ['Machine Learning', 'Health Informatics', 'NLP'],
      imageUrl: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '4',
      name: 'Alex Kim',
      role: 'PhD Candidate',
      bio: 'Researching the impact of social media on adolescent wellbeing.',
      expertise: ['Social Media', 'Youth Studies', 'Mixed Methods'],
      imageUrl: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '5',
      name: 'Jordan Lee',
      role: 'Research Assistant',
      bio: 'Supporting data collection and analysis for multiple ongoing projects.',
      expertise: ['Data Analysis', 'Python', 'R'],
      imageUrl: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  blogPosts = [
    {
      id: '1',
      title: 'Rethinking Data Privacy in the Age of AI',
      excerpt: 'Traditional privacy frameworks may not be sufficient for protecting individuals in AI-driven ecosystems. We explore new approaches to data governance.',
      author: 'Dr. Sarah Chen',
      authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: new Date('2025-10-25').toISOString(),
      readTime: '8 min read'
    },
    {
      id: '2',
      title: 'Measuring What Matters: Beyond Screen Time',
      excerpt: 'Screen time alone doesn\'t tell us much about digital wellbeing. Here\'s what we should be measuring instead.',
      author: 'Dr. Marcus Johnson',
      authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: new Date('2025-10-18').toISOString(),
      readTime: '6 min read'
    },
    {
      id: '3',
      title: 'The Ethics of Sentiment Analysis in Healthcare',
      excerpt: 'As NLP techniques become more sophisticated, we must carefully consider their ethical implications in sensitive domains like mental health.',
      author: 'Dr. Priya Patel',
      authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: new Date('2025-10-12').toISOString(),
      readTime: '10 min read'
    },
    {
      id: '4',
      title: 'Social Media and Teen Mental Health: Preliminary Findings',
      excerpt: 'Early insights from our longitudinal study reveal nuanced patterns in how different social media behaviors affect adolescent wellbeing.',
      author: 'Alex Kim',
      authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: new Date('2025-10-05').toISOString(),
      readTime: '7 min read'
    },
    {
      id: '5',
      title: 'Building Trust Through Data Transparency',
      excerpt: 'How organizations can build public trust by being more transparent about their data practices and algorithmic decision-making.',
      author: 'Dr. Sarah Chen',
      authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: new Date('2025-09-28').toISOString(),
      readTime: '9 min read'
    },
    {
      id: '6',
      title: 'Data Minimization: Less is More',
      excerpt: 'The principle of data minimization and why collecting less data often leads to better outcomes for both users and organizations.',
      author: 'Jordan Lee',
      authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      date: new Date('2025-09-21').toISOString(),
      readTime: '5 min read'
    }
  ];

  researchProjects = [
    {
      id: '1',
      title: 'Digital wellbeing Metrics Framework',
      description: 'Developing comprehensive metrics to assess individual and collective digital wellbeing across various platforms and contexts.',
      status: 'Active',
      tags: ['Metrics', 'Framework', 'wellbeing'],
      imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '2',
      title: 'Privacy-Preserving Data Collection',
      description: 'Creating novel methodologies for collecting sensitive personal data while maintaining privacy and ethical standards.',
      status: 'Active',
      tags: ['Privacy', 'Ethics', 'Methodology'],
      imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '3',
      title: 'Social Media Impact Study',
      description: 'Longitudinal study examining the relationship between social media use patterns and mental health outcomes in young adults.',
      status: 'Active',
      tags: ['Social Media', 'Mental Health', 'Longitudinal'],
      imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '4',
      title: 'AI Transparency Tools',
      description: 'Building open-source tools to help users understand how AI systems use their data and make decisions.',
      status: 'Planning',
      tags: ['AI', 'Transparency', 'Open Source'],
      imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '5',
      title: 'Data Governance Best Practices',
      description: 'Developing frameworks and guidelines for ethical data governance in public and private sectors.',
      status: 'Completed',
      tags: ['Policy', 'Governance', 'Best Practices'],
      imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '6',
      title: 'Children\'s Digital Rights',
      description: 'Research on protecting children\'s rights in digital spaces, informing policy and platform design.',
      status: 'Active',
      tags: ['Children', 'Rights', 'Policy'],
      imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

  partners = [
    {
      id: '1',
      name: 'Digital Health Institute',
      type: 'Academic Partner',
      description: 'Collaborative research on health data governance and ethical frameworks for medical AI systems.'
    },
    {
      id: '2',
      name: 'Tech for Good Foundation',
      type: 'Funding Partner',
      description: 'Supporting our privacy-preserving data collection project and youth digital wellbeing initiatives.'
    },
    {
      id: '3',
      name: 'Global Privacy Alliance',
      type: 'Industry Partner',
      description: 'Joint initiatives on data ethics standards and international privacy policy development.'
    },
    {
      id: '4',
      name: 'Youth wellbeing Coalition',
      type: 'Community Partner',
      description: 'Co-designing research with young people to ensure their voices shape digital policy.'
    },
    {
      id: '5',
      name: 'Open Data Lab',
      type: 'Research Partner',
      description: 'Shared infrastructure and methodology development for ethical data science research.'
    },
    {
      id: '6',
      name: 'Ethical AI Consortium',
      type: 'Industry Partner',
      description: 'Developing transparency frameworks and best practices for responsible AI deployment.'
    },
    {
      id: '7',
      name: 'University Research Network',
      type: 'Academic Partner',
      description: 'Multi-institutional collaboration on digital wellbeing metrics and longitudinal studies.'
    },
    {
      id: '8',
      name: 'Policy Impact Center',
      type: 'Policy Partner',
      description: 'Translating research findings into actionable policy recommendations for governments.'
    },
    {
      id: '9',
      name: 'Community Data Trust',
      type: 'Community Partner',
      description: 'Empowering communities to govern their own data with ethical frameworks and tools.'
    }
  ];

  res.json({ success: true, message: 'Data initialized successfully' });
});

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch-all for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;