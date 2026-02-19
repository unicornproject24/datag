import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Team Members Routes
app.get('/make-server-eb1fb471/team-members', async (c) => {
  try {
    const members = await kv.getByPrefix('team_member:');
    return c.json({ success: true, data: members });
  } catch (error) {
    console.log('Error fetching team members:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post('/make-server-eb1fb471/team-members', async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || `team_${Date.now()}`;
    await kv.set(`team_member:${id}`, body);
    return c.json({ success: true, data: { id, ...body } });
  } catch (error) {
    console.log('Error creating team member:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put('/make-server-eb1fb471/team-members/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    await kv.set(`team_member:${id}`, { id, ...body });
    return c.json({ success: true, data: { id, ...body } });
  } catch (error) {
    console.log('Error updating team member:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete('/make-server-eb1fb471/team-members/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`team_member:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting team member:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Blog Posts Routes
app.get('/make-server-eb1fb471/blog-posts', async (c) => {
  try {
    const posts = await kv.getByPrefix('blog_post:');
    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return c.json({ success: true, data: posts });
  } catch (error) {
    console.log('Error fetching blog posts:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post('/make-server-eb1fb471/blog-posts', async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || `blog_${Date.now()}`;
    await kv.set(`blog_post:${id}`, { id, ...body });
    return c.json({ success: true, data: { id, ...body } });
  } catch (error) {
    console.log('Error creating blog post:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put('/make-server-eb1fb471/blog-posts/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    await kv.set(`blog_post:${id}`, { id, ...body });
    return c.json({ success: true, data: { id, ...body } });
  } catch (error) {
    console.log('Error updating blog post:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete('/make-server-eb1fb471/blog-posts/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`blog_post:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting blog post:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Research Projects Routes
app.get('/make-server-eb1fb471/research-projects', async (c) => {
  try {
    const projects = await kv.getByPrefix('research_project:');
    return c.json({ success: true, data: projects });
  } catch (error) {
    console.log('Error fetching research projects:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post('/make-server-eb1fb471/research-projects', async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || `research_${Date.now()}`;
    await kv.set(`research_project:${id}`, { id, ...body });
    return c.json({ success: true, data: { id, ...body } });
  } catch (error) {
    console.log('Error creating research project:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put('/make-server-eb1fb471/research-projects/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    await kv.set(`research_project:${id}`, { id, ...body });
    return c.json({ success: true, data: { id, ...body } });
  } catch (error) {
    console.log('Error updating research project:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete('/make-server-eb1fb471/research-projects/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`research_project:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting research project:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Partners Routes
app.get('/make-server-eb1fb471/partners', async (c) => {
  try {
    const partners = await kv.getByPrefix('partner:');
    return c.json({ success: true, data: partners });
  } catch (error) {
    console.log('Error fetching partners:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.post('/make-server-eb1fb471/partners', async (c) => {
  try {
    const body = await c.req.json();
    const id = body.id || `partner_${Date.now()}`;
    await kv.set(`partner:${id}`, { id, ...body });
    return c.json({ success: true, data: { id, ...body } });
  } catch (error) {
    console.log('Error creating partner:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.put('/make-server-eb1fb471/partners/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    await kv.set(`partner:${id}`, { id, ...body });
    return c.json({ success: true, data: { id, ...body } });
  } catch (error) {
    console.log('Error updating partner:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

app.delete('/make-server-eb1fb471/partners/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(`partner:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting partner:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Initialize database with default data (run only once)
app.post('/make-server-eb1fb471/initialize-data', async (c) => {
  try {
    // Check if data already exists
    const existingMembers = await kv.getByPrefix('team_member:');
    if (existingMembers.length > 0) {
      return c.json({ success: true, message: 'Data already initialized' });
    }

    // Initialize team members
    const teamMembers = [
      {
        id: 'team_1',
        name: 'Dr. Sarah Chen',
        role: 'Principal Investigator',
        bio: 'Leading research in data ethics and digital well-being with 15+ years of experience.',
        expertise: ['Data Ethics', 'Privacy', 'AI Policy'],
        imageUrl: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 'team_2',
        name: 'Dr. Marcus Johnson',
        role: 'Senior Researcher',
        bio: 'Specializes in quantitative methods for measuring digital well-being outcomes.',
        expertise: ['Statistics', 'Survey Design', 'Behavioral Analysis'],
        imageUrl: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 'team_3',
        name: 'Dr. Priya Patel',
        role: 'Research Fellow',
        bio: 'Focuses on the intersection of data science and mental health.',
        expertise: ['Machine Learning', 'Health Informatics', 'NLP'],
        imageUrl: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 'team_4',
        name: 'Alex Kim',
        role: 'PhD Candidate',
        bio: 'Researching the impact of social media on adolescent well-being.',
        expertise: ['Social Media', 'Youth Studies', 'Mixed Methods'],
        imageUrl: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 'team_5',
        name: 'Jordan Lee',
        role: 'Research Assistant',
        bio: 'Supporting data collection and analysis for multiple ongoing projects.',
        expertise: ['Data Analysis', 'Python', 'R'],
        imageUrl: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
      }
    ];

    for (const member of teamMembers) {
      await kv.set(`team_member:${member.id}`, member);
    }

    // Initialize blog posts
    const blogPosts = [
      {
        id: 'blog_1',
        title: 'Rethinking Data Privacy in the Age of AI',
        excerpt: 'Traditional privacy frameworks may not be sufficient for protecting individuals in AI-driven ecosystems. We explore new approaches to data governance.',
        author: 'Dr. Sarah Chen',
        authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        date: '2025-10-25',
        readTime: '8 min read'
      },
      {
        id: 'blog_2',
        title: 'Measuring What Matters: Beyond Screen Time',
        excerpt: 'Screen time alone doesn\'t tell us much about digital well-being. Here\'s what we should be measuring instead.',
        author: 'Dr. Marcus Johnson',
        authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        date: '2025-10-18',
        readTime: '6 min read'
      },
      {
        id: 'blog_3',
        title: 'The Ethics of Sentiment Analysis in Healthcare',
        excerpt: 'As NLP techniques become more sophisticated, we must carefully consider their ethical implications in sensitive domains like mental health.',
        author: 'Dr. Priya Patel',
        authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        date: '2025-10-12',
        readTime: '10 min read'
      },
      {
        id: 'blog_4',
        title: 'Social Media and Teen Mental Health: Preliminary Findings',
        excerpt: 'Early insights from our longitudinal study reveal nuanced patterns in how different social media behaviors affect adolescent well-being.',
        author: 'Alex Kim',
        authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        date: '2025-10-05',
        readTime: '7 min read'
      },
      {
        id: 'blog_5',
        title: 'Building Trust Through Data Transparency',
        excerpt: 'How organizations can build public trust by being more transparent about their data practices and algorithmic decision-making.',
        author: 'Dr. Sarah Chen',
        authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        date: '2025-09-28',
        readTime: '9 min read'
      },
      {
        id: 'blog_6',
        title: 'Data Minimization: Less is More',
        excerpt: 'The principle of data minimization and why collecting less data often leads to better outcomes for both users and organizations.',
        author: 'Jordan Lee',
        authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        date: '2025-09-21',
        readTime: '5 min read'
      }
    ];

    for (const post of blogPosts) {
      await kv.set(`blog_post:${post.id}`, post);
    }

    // Initialize research projects
    const projects = [
      {
        id: 'research_1',
        title: 'Digital Well-being Metrics Framework',
        description: 'Developing comprehensive metrics to assess individual and collective digital well-being across various platforms and contexts.',
        status: 'Active',
        tags: ['Metrics', 'Framework', 'Well-being'],
        imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 'research_2',
        title: 'Privacy-Preserving Data Collection',
        description: 'Creating novel methodologies for collecting sensitive personal data while maintaining privacy and ethical standards.',
        status: 'Active',
        tags: ['Privacy', 'Ethics', 'Methodology'],
        imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 'research_3',
        title: 'Social Media Impact Study',
        description: 'Longitudinal study examining the relationship between social media use patterns and mental health outcomes in young adults.',
        status: 'Active',
        tags: ['Social Media', 'Mental Health', 'Longitudinal'],
        imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 'research_4',
        title: 'AI Transparency Tools',
        description: 'Building open-source tools to help users understand how AI systems use their data and make decisions.',
        status: 'Planning',
        tags: ['AI', 'Transparency', 'Open Source'],
        imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 'research_5',
        title: 'Data Governance Best Practices',
        description: 'Developing frameworks and guidelines for ethical data governance in public and private sectors.',
        status: 'Completed',
        tags: ['Policy', 'Governance', 'Best Practices'],
        imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        id: 'research_6',
        title: 'Children\'s Digital Rights',
        description: 'Research on protecting children\'s rights in digital spaces, informing policy and platform design.',
        status: 'Active',
        tags: ['Children', 'Rights', 'Policy'],
        imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
      }
    ];

    for (const project of projects) {
      await kv.set(`research_project:${project.id}`, project);
    }

    // Initialize partners
    const partners = [
      {
        id: 'partner_1',
        name: 'Digital Health Institute',
        type: 'Academic Partner',
        description: 'Collaborative research on health data governance and ethical frameworks for medical AI systems.'
      },
      {
        id: 'partner_2',
        name: 'Tech for Good Foundation',
        type: 'Funding Partner',
        description: 'Supporting our privacy-preserving data collection project and youth digital well-being initiatives.'
      },
      {
        id: 'partner_3',
        name: 'Global Privacy Alliance',
        type: 'Industry Partner',
        description: 'Joint initiatives on data ethics standards and international privacy policy development.'
      },
      {
        id: 'partner_4',
        name: 'Youth Well-being Coalition',
        type: 'Community Partner',
        description: 'Co-designing research with young people to ensure their voices shape digital policy.'
      },
      {
        id: 'partner_5',
        name: 'Open Data Lab',
        type: 'Research Partner',
        description: 'Shared infrastructure and methodology development for ethical data science research.'
      },
      {
        id: 'partner_6',
        name: 'Ethical AI Consortium',
        type: 'Industry Partner',
        description: 'Developing transparency frameworks and best practices for responsible AI deployment.'
      },
      {
        id: 'partner_7',
        name: 'University Research Network',
        type: 'Academic Partner',
        description: 'Multi-institutional collaboration on digital well-being metrics and longitudinal studies.'
      },
      {
        id: 'partner_8',
        name: 'Policy Impact Center',
        type: 'Policy Partner',
        description: 'Translating research findings into actionable policy recommendations for governments.'
      },
      {
        id: 'partner_9',
        name: 'Community Data Trust',
        type: 'Community Partner',
        description: 'Empowering communities to govern their own data with ethical frameworks and tools.'
      }
    ];

    for (const partner of partners) {
      await kv.set(`partner:${partner.id}`, partner);
    }

    return c.json({ success: true, message: 'Data initialized successfully' });
  } catch (error) {
    console.log('Error initializing data:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
