import express from 'express';
import prisma from '../utils/prisma';

const router = express.Router();

// Initialize database with default data (run only once)
router.post('/', async (req, res) => {
  try {
    // Check if data already exists
    const existingMembers = await prisma.teamMember.count();
    if (existingMembers > 0) {
      return res.json({ success: true, message: 'Data already initialized' });
    }

    // Initialize team members
    const teamMembers = [
      {
        name: 'Dr. Sarah Chen',
        role: 'Principal Investigator',
        bio: 'Leading research in data ethics and digital well-being with 15+ years of experience.',
        expertise: ['Data Ethics', 'Privacy', 'AI Policy'],
        imageUrl: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        name: 'Dr. Marcus Johnson',
        role: 'Senior Researcher',
        bio: 'Specializes in quantitative methods for measuring digital well-being outcomes.',
        expertise: ['Statistics', 'Survey Design', 'Behavioral Analysis'],
        imageUrl: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        name: 'Dr. Priya Patel',
        role: 'Research Fellow',
        bio: 'Focuses on the intersection of data science and mental health.',
        expertise: ['Machine Learning', 'Health Informatics', 'NLP'],
        imageUrl: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        name: 'Alex Kim',
        role: 'PhD Candidate',
        bio: 'Researching the impact of social media on adolescent well-being.',
        expertise: ['Social Media', 'Youth Studies', 'Mixed Methods'],
        imageUrl: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        name: 'Jordan Lee',
        role: 'Research Assistant',
        bio: 'Supporting data collection and analysis for multiple ongoing projects.',
        expertise: ['Data Analysis', 'Python', 'R'],
        imageUrl: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080'
      }
    ];

    for (const member of teamMembers) {
      await prisma.teamMember.create({
        data: member
      });
    }

    // Initialize blog posts
    const blogPosts = [
      {
        title: 'Rethinking Data Privacy in the Age of AI',
        excerpt: 'Traditional privacy frameworks may not be sufficient for protecting individuals in AI-driven ecosystems. We explore new approaches to data governance.',
        author: 'Dr. Sarah Chen',
        authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        date: new Date('2025-10-25'),
        readTime: '8 min read'
      },
      {
        title: 'Measuring What Matters: Beyond Screen Time',
        excerpt: 'Screen time alone doesn\'t tell us much about digital well-being. Here\'s what we should be measuring instead.',
        author: 'Dr. Marcus Johnson',
        authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        date: new Date('2025-10-18'),
        readTime: '6 min read'
      },
      {
        title: 'The Ethics of Sentiment Analysis in Healthcare',
        excerpt: 'As NLP techniques become more sophisticated, we must carefully consider their ethical implications in sensitive domains like mental health.',
        author: 'Dr. Priya Patel',
        authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        date: new Date('2025-10-12'),
        readTime: '10 min read'
      },
      {
        title: 'Social Media and Teen Mental Health: Preliminary Findings',
        excerpt: 'Early insights from our longitudinal study reveal nuanced patterns in how different social media behaviors affect adolescent well-being.',
        author: 'Alex Kim',
        authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        date: new Date('2025-10-05'),
        readTime: '7 min read'
      },
      {
        title: 'Building Trust Through Data Transparency',
        excerpt: 'How organizations can build public trust by being more transparent about their data practices and algorithmic decision-making.',
        author: 'Dr. Sarah Chen',
        authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        date: new Date('2025-09-28'),
        readTime: '9 min read'
      },
      {
        title: 'Data Minimization: Less is More',
        excerpt: 'The principle of data minimization and why collecting less data often leads to better outcomes for both users and organizations.',
        author: 'Jordan Lee',
        authorImage: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjByZXNlYXJjaGVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTA3NzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        date: new Date('2025-09-21'),
        readTime: '5 min read'
      }
    ];

    for (const post of blogPosts) {
      await prisma.blogPost.create({
        data: post
      });
    }

    // Initialize research projects
    const projects = [
      {
        title: 'Digital Well-being Metrics Framework',
        description: 'Developing comprehensive metrics to assess individual and collective digital well-being across various platforms and contexts.',
        status: 'Active',
        tags: ['Metrics', 'Framework', 'Well-being'],
        imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        title: 'Privacy-Preserving Data Collection',
        description: 'Creating novel methodologies for collecting sensitive personal data while maintaining privacy and ethical standards.',
        status: 'Active',
        tags: ['Privacy', 'Ethics', 'Methodology'],
        imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        title: 'Social Media Impact Study',
        description: 'Longitudinal study examining the relationship between social media use patterns and mental health outcomes in young adults.',
        status: 'Active',
        tags: ['Social Media', 'Mental Health', 'Longitudinal'],
        imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        title: 'AI Transparency Tools',
        description: 'Building open-source tools to help users understand how AI systems use their data and make decisions.',
        status: 'Planning',
        tags: ['AI', 'Transparency', 'Open Source'],
        imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        title: 'Data Governance Best Practices',
        description: 'Developing frameworks and guidelines for ethical data governance in public and private sectors.',
        status: 'Completed',
        tags: ['Policy', 'Governance', 'Best Practices'],
        imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
      },
      {
        title: 'Children\'s Digital Rights',
        description: 'Research on protecting children\'s rights in digital spaces, informing policy and platform design.',
        status: 'Active',
        tags: ['Children', 'Rights', 'Policy'],
        imageUrl: 'https://images.unsplash.com/photo-1758626101945-ed0068aad9f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZSUyMHJlc2VhcmNofGVufDF8fHx8MTc2MTkzODcxNXww&ixlib=rb-4.1.0&q=80&w=1080'
      }
    ];

    for (const project of projects) {
      await prisma.researchProject.create({
        data: project
      });
    }

    // Initialize partners
    const partners = [
      {
        name: 'Digital Health Institute',
        type: 'Academic Partner',
        description: 'Collaborative research on health data governance and ethical frameworks for medical AI systems.'
      },
      {
        name: 'Tech for Good Foundation',
        type: 'Funding Partner',
        description: 'Supporting our privacy-preserving data collection project and youth digital well-being initiatives.'
      },
      {
        name: 'Global Privacy Alliance',
        type: 'Industry Partner',
        description: 'Joint initiatives on data ethics standards and international privacy policy development.'
      },
      {
        name: 'Youth Well-being Coalition',
        type: 'Community Partner',
        description: 'Co-designing research with young people to ensure their voices shape digital policy.'
      },
      {
        name: 'Open Data Lab',
        type: 'Research Partner',
        description: 'Shared infrastructure and methodology development for ethical data science research.'
      },
      {
        name: 'Ethical AI Consortium',
        type: 'Industry Partner',
        description: 'Developing transparency frameworks and best practices for responsible AI deployment.'
      },
      {
        name: 'University Research Network',
        type: 'Academic Partner',
        description: 'Multi-institutional collaboration on digital well-being metrics and longitudinal studies.'
      },
      {
        name: 'Policy Impact Center',
        type: 'Policy Partner',
        description: 'Translating research findings into actionable policy recommendations for governments.'
      },
      {
        name: 'Community Data Trust',
        type: 'Community Partner',
        description: 'Empowering communities to govern their own data with ethical frameworks and tools.'
      }
    ];

    for (const partner of partners) {
      await prisma.partner.create({
        data: partner
      });
    }

    return res.json({ success: true, message: 'Data initialized successfully' });
  } catch (error) {
    console.log('Error initializing data:', error);
    return res.status(500).json({ success: false, error: String(error) });
  }
});

export default router;