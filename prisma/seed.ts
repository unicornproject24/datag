import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
  
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@datawellbeing.org' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@datawellbeing.org',
      password: adminPassword,
      name: process.env.DEFAULT_ADMIN_NAME || 'System Administrator',
      role: 'ADMIN',
      status: 'APPROVED',
      emailVerified: true,
      isPublic: false
    }
  });

  console.log('Admin user created:', admin.email);

  // Create demo team member
  const teamPassword = await bcrypt.hash('team123', 12);
  
  const teamMember = await prisma.user.upsert({
    where: { email: 'team@datawellbeing.org' },
    update: {},
    create: {
      email: 'team@datawellbeing.org',
      password: teamPassword,
      name: 'Demo Team Member',
      role: 'TEAM_MEMBER',
      status: 'APPROVED',
      emailVerified: true,
      isPublic: true,
      bio: 'A dedicated team member working on data wellbeing research.',
      researchInterests: ['Data Ethics', 'AI Safety', 'Digital Wellness']
    }
  });

  console.log('Team member created:', teamMember.email);

  // Seed Team Members for public display
  
  // Victor Ifeanyi Chigbo
  const victor = await prisma.teamMember.upsert({
    where: { id: 'victor-chigbo-001' },
    update: {},
    create: {
      id: 'victor-chigbo-001',
      name: 'Victor Ifeanyi Chigbo',
      preferredName: 'Victor',
      role: 'Systems Architect and AI/ML Developer',
      bio: 'Victor Chigbo ("Ifeanyi") is a Data & AI Systems Architect with extensive experience designing and delivering end-to-end enterprise and data solutions across healthcare, e-commerce, public sector, and economic systems. Over the past five years, he has focused on leveraging Machine Learning and AI to improve the efficiency, scalability, and robustness of data processing pipelines. He has led the development of ERP systems, centralized data platforms, and multi-channel customer service solutions supporting high-volume, geographically distributed operations. With strong experience in applied AI/ML and analytics, he has delivered complex, data-driven initiatives focused on optimisation and operational decision support. His work centres on outcome-focused AI solutions designed for reliability, scalability, and real-world impact.',
      expertise: ['System Architecture', 'AI', 'ML', 'Healthcare', 'E-Commerce'],
      researchInterests: [
        'Responsible and Practical AI Systems – Designing AI-enabled solutions that are transparent, reliable, and operationally sound, with a strong focus on real-world usability, governance, and measurable impact.',
        'AI-Enabled Decision Support and Analytics – Applying machine learning, statistical methods, and data-driven approaches to support decision-making in complex environments such as healthcare, public services, and enterprise operations.',
        'Predictive Modelling, Forecasting, and Risk Analytics – Developing models to anticipate trends, demand, and risk in large-scale, high-volume systems operating under uncertainty and evolving conditions.',
        'Computer Vision and Intelligent Monitoring Systems – Designing and deploying computer vision solutions for detection, classification, and situational awareness, with a focus on reliability, performance, and human-in-the-loop decision support.',
        'Data-Centric AI and Intelligent Pipelines – Building robust data architectures and pipelines that enable scalable analytics, real-time monitoring, and AI-driven insights across distributed and multi-channel systems.'
      ],
      education: 'MSc. Applied AI and Data Science – Solent University, UK',
      links: {
        linkedIn: 'https://www.linkedin.com/in/victor-chigbo-55847b16/'
      },
      imageUrl: 'https://via.placeholder.com/400x400/4A5568/FFFFFF?text=Victor+C',
      consentGiven: true,
      consentName: 'Victor Chigbo',
      consentDate: new Date('2026-01-22'),
      isPublic: true
    }
  });

  console.log('Team member created:', victor.name);

  // Abiodun Ajanaku
  const abiodun = await prisma.teamMember.upsert({
    where: { id: 'abiodun-ajanaku-001' },
    update: {},
    create: {
      id: 'abiodun-ajanaku-001',
      name: 'Abiodun Ajanaku',
      preferredName: 'Biodun',
      role: 'Data Analyst and Literature Researcher',
      bio: 'Abiodun Ajanaku ("Biodun") is a Data Scientist and AI/ML Researcher with expertise in applying artificial intelligence across healthcare, finance, education, and human-centred systems. He is also a corporate and entrepreneurial finance expert and interdisciplinary researcher with over 17 years of experience advising boards, executives, and founders of technology-driven ventures on building resilient, future-ready businesses. Over the past five years, he has delivered real-world impact through predictive modelling, risk analytics, and AI-driven decision-support systems that combine rigorous computation with practical relevance. His research sits at the intersection of AI innovation and strategic decision-making, with a focus on adaptive intelligence and responsible, human-centred AI in complex socio-economic and organisational systems.',
      expertise: ['Data Science', 'Healthcare', 'Data Analysis', 'Education', 'Human-Centred AI'],
      researchInterests: [
        'Human-Centred and Responsible AI – Designing AI systems that are transparent, ethical, and aligned with human values, wellbeing, and social impact.',
        'AI-Driven Decision Support Systems – Applying machine learning to improve decision-making in finance, healthcare, and education under uncertainty and data constraints.',
        'Predictive Modelling and Risk Analytics – Using AI to anticipate risk, resilience, and outcomes in complex socio-economic and organisational systems.',
        'AI for Wellbeing and Mental Health – Leveraging NLP and behavioural data to support mental health, communication quality, and emotional wellbeing.',
        'Technology, Behaviour, and Adaptive Systems – Studying how humans interact with intelligent systems and how AI can adapt to cognitive, social, and cultural contexts.'
      ],
      projects: [
        {
          title: 'AI-Powered Predictive Intelligence for Startup Risk Assessment',
          description: 'Published on SSRN as "Artificial Intelligence for Startup Risk and Investment Due Diligence: A Machine Learning Model from the African Innovation Ecosystem." The model is now shaping investor due diligence and risk assessment frameworks across emerging markets.'
        },
        {
          title: 'Machine Learning for Consulting Cost Forecasting',
          description: 'Published on SSRN as "Practical Applications of Machine Learning in Predicting the Cost of Consulting Projects," improving budget transparency and forecasting accuracy within professional services.'
        },
        {
          title: 'AI in Healthcare Risk Prediction',
          description: 'Published on SSRN as "Predicting the Risk of Cancer in Adults," demonstrating transferable machine learning techniques for high-stakes predictive modeling in healthcare.'
        }
      ],
      education: 'MSc. Applied AI and Data Science – Solent University, UK',
      links: {
        linkedIn: 'https://www.linkedin.com/in/abiodun-ajanaku-6185b417/',
        youtube: 'https://www.youtube.com/watch?v=8W89GPRB0F0',
        orcid: 'https://orcid.org/0009-0001-7391-0561'
      },
      imageUrl: 'https://via.placeholder.com/400x400/2D3748/FFFFFF?text=Abiodun+A',
      consentGiven: true,
      consentName: 'Abiodun Ajanaku',
      consentDate: new Date('2024-12-22'),
      isPublic: true
    }
  });

  console.log('Team member created:', abiodun.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
