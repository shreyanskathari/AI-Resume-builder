import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultInitialData = {
  users: [
    {
      id: 'demo-user-1',
      name: 'Alex Rivera',
      email: 'demo@student.edu',
      passwordHash: '$2a$10$wT0X8U3d7m9u/HkW4F7Hk.1n4y8Vw9w9p8vJ6e9k0l1m2n3o4p5q6', // 'password123'
      role: 'Aspiring Full Stack Engineer',
      createdAt: new Date().toISOString()
    }
  ],
  resumes: [
    {
      id: 'resume-demo-1',
      userId: 'demo-user-1',
      title: 'Full Stack Software Engineer - Fresher',
      targetRole: 'Software Engineer / Full Stack Developer',
      templateId: 'modern',
      personalInfo: {
        fullName: 'Alex Rivera',
        title: 'Full Stack Developer & CS Graduate',
        email: 'alex.rivera.dev@gmail.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com/in/alexrivera-dev',
        github: 'https://github.com/alexrivera',
        portfolio: 'https://alexrivera.dev',
        summary: 'Driven Computer Science graduate with hands-on experience building scalable full-stack web applications and RESTful APIs using React, Node.js, and TypeScript. Proven track record of developing cloud-deployed applications, optimizing database queries by 35%, and collaborating in agile student development teams. Eager to contribute technical rigor and modern software engineering practices to a high-impact engineering team.'
      },
      education: [
        {
          id: 'edu-1',
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          location: 'Berkeley, CA',
          startDate: '2022-09',
          endDate: '2026-05',
          gpa: '3.85 / 4.0',
          honors: 'Dean\'s Honor List (4 Semesters), ACM Student Chapter Lead',
          coursework: 'Data Structures & Algorithms, Database Systems, Cloud Computing, Operating Systems, Machine Learning'
        }
      ],
      skills: {
        technical: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'Java', 'C++', 'SQL'],
        frameworks: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'FastAPI'],
        tools: ['Git & GitHub', 'Docker', 'PostgreSQL', 'MongoDB', 'AWS (S3, EC2)', 'Redis', 'Jest', 'Postman'],
        soft: ['Agile / Scrum', 'Problem Solving', 'Technical Communication', 'Pair Programming', 'Time Management'],
        languages: ['English (Native)', 'Spanish (Conversational)']
      },
      projects: [
        {
          id: 'proj-1',
          title: 'CareerPath - AI Mentorship & Job Matching Platform',
          techStack: 'React, Node.js, Express, PostgreSQL, OpenAI API, Tailwind CSS',
          liveUrl: 'https://careerpath-demo.vercel.app',
          githubUrl: 'https://github.com/alexrivera/careerpath',
          startDate: '2025-08',
          endDate: '2025-12',
          bullets: [
            'Architected a full-stack job recommendation portal serving 1,200+ active university students with personalized career roadmaps.',
            'Engineered automated semantic resume-to-job matching using vector embeddings, improving job search relevance by 42%.',
            'Integrated JWT authentication and PostgreSQL with connection pooling, maintaining sub-80ms API response latency under load.',
            'Deployed Dockerized microservices to AWS EC2 with automated CI/CD pipelines via GitHub Actions.'
          ]
        },
        {
          id: 'proj-2',
          title: 'PulseStream - Real-time Collaborative Task Hub',
          techStack: 'TypeScript, Next.js, Socket.io, Redis, Tailwind CSS',
          liveUrl: 'https://pulsestream.dev',
          githubUrl: 'https://github.com/alexrivera/pulsestream',
          startDate: '2025-01',
          endDate: '2025-05',
          bullets: [
            'Built a real-time collaborative workspace supporting live multi-user whiteboard editing and Kanban task synchronization.',
            'Implemented WebSockets with Redis Pub/Sub backend to reliably broadcast updates across concurrent rooms with <30ms latency.',
            'Optimized client-side rendering with React memoization and virtualized lists, reducing UI lag during high-frequency data streams.'
          ]
        }
      ],
      internships: [
        {
          id: 'intern-1',
          company: 'CloudNova Technologies',
          role: 'Software Engineering Intern',
          location: 'San Jose, CA (Remote)',
          startDate: '2025-06',
          endDate: '2025-08',
          bullets: [
            'Developed and tested 6 internal microservice endpoints in Node.js/TypeScript processing 50k+ daily analytics telemetry events.',
            'Reduced SQL query execution time by 35% by redesigning relational indexes and implementing Redis caching for frequent aggregations.',
            'Authored comprehensive unit and integration tests with Jest, elevating code test coverage from 68% to 89% across core modules.',
            'Collaborated with senior engineers in daily standups and bi-weekly sprint reviews following Agile methodologies.'
          ]
        }
      ],
      experience: [],
      certifications: [
        {
          id: 'cert-1',
          name: 'AWS Certified Cloud Practitioner',
          issuer: 'Amazon Web Services',
          date: '2025-07',
          url: 'https://aws.amazon.com/verification'
        },
        {
          id: 'cert-2',
          name: 'Meta Front-End Developer Professional Certificate',
          issuer: 'Coursera / Meta',
          date: '2024-11',
          url: 'https://coursera.org/verify/meta'
        }
      ],
      achievements: [
        {
          id: 'ach-1',
          title: '1st Place Winner - CalHacks 11.0 Hackathon',
          date: '2024-10',
          description: 'Built an accessible speech-to-text educational assistant for neurodivergent learners among 250+ competing university teams.'
        },
        {
          id: 'ach-2',
          title: 'Top 5% Contributor - Open Source GitHub Student Collective',
          date: '2025-03',
          description: 'Contributed 15+ merged pull requests addressing bug fixes and documentation in popular React community libraries.'
        }
      ],
      atsScore: 92,
      resumeScore: 94,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  jobMatches: [
    {
      id: 'jm-1',
      userId: 'demo-user-1',
      resumeId: 'resume-demo-1',
      jobTitle: 'Junior Software Engineer',
      company: 'Stripe',
      jobDescription: 'Looking for a Junior Software Engineer passionate about web development, APIs, TypeScript, Node.js, React, Docker, and distributed systems. Experience with relational databases and CI/CD pipelines is preferred.',
      matchScore: 88,
      matchedKeywords: ['TypeScript', 'Node.js', 'React', 'Docker', 'APIs', 'Relational Databases', 'CI/CD'],
      missingKeywords: ['Distributed Systems', 'Kafka', 'Microservices Architecture'],
      recommendations: [
        'Add details about distributed messaging or queues (like Redis, BullMQ or Kafka) in your PulseStream project.',
        'Highlight database schema design and ACID transaction management in your CloudNova internship bullets.'
      ],
      projectSuggestions: [
        {
          title: 'Distributed Event-Driven Order Processing System',
          techStack: 'Node.js, Kafka / RabbitMQ, Docker, PostgreSQL',
          description: 'A mock fintech service that consumes transaction events, guarantees idempotency, and handles worker failovers.'
        }
      ],
      createdAt: new Date().toISOString()
    }
  ],
  interviewPreps: [],
  applications: [
    {
      id: 'app-1',
      userId: 'demo-user-1',
      company: 'Stripe',
      position: 'Junior Software Engineer',
      status: 'Interviewing',
      appliedDate: '2026-02-15',
      salary: '$115,000 / yr',
      notes: 'Completed technical screen. Next round is system architecture & coding challenge on Thursday.',
      url: 'https://stripe.com/jobs',
      createdAt: new Date().toISOString()
    },
    {
      id: 'app-2',
      userId: 'demo-user-1',
      company: 'Datadog',
      position: 'Associate Frontend Engineer',
      status: 'Applied',
      appliedDate: '2026-02-22',
      salary: '$105,000 / yr',
      notes: 'Referred by university alum on LinkedIn.',
      url: 'https://careers.datadoghq.com',
      createdAt: new Date().toISOString()
    },
    {
      id: 'app-3',
      userId: 'demo-user-1',
      company: 'GitHub',
      position: 'Graduate Software Engineer',
      status: 'Offered',
      appliedDate: '2026-01-10',
      salary: '$120,000 / yr',
      notes: 'Offer letter received! Reviewing benefits and compensation packet.',
      url: 'https://github.careers',
      createdAt: new Date().toISOString()
    }
  ]
};

class Database {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('[DB] Error reading database file, resetting to defaults:', err.message);
    }
    this.save(defaultInitialData);
    return JSON.parse(JSON.stringify(defaultInitialData));
  }

  save(dataToSave = this.data) {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('[DB] Error persisting database:', err.message);
    }
  }

  // Users
  getUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  createUser(userData) {
    const newUser = {
      id: 'user_' + Math.random().toString(36).substring(2, 10),
      createdAt: new Date().toISOString(),
      ...userData
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  // Resumes
  getResumesByUser(userId) {
    return this.data.resumes.filter(r => r.userId === userId);
  }

  getResumeById(id, userId) {
    return this.data.resumes.find(r => r.id === id && (!userId || r.userId === userId));
  }

  createResume(resumeData) {
    const newResume = {
      id: 'res_' + Math.random().toString(36).substring(2, 10),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...resumeData
    };
    this.data.resumes.push(newResume);
    this.save();
    return newResume;
  }

  updateResume(id, userId, updates) {
    const idx = this.data.resumes.findIndex(r => r.id === id && r.userId === userId);
    if (idx === -1) return null;
    this.data.resumes[idx] = {
      ...this.data.resumes[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.resumes[idx];
  }

  deleteResume(id, userId) {
    const idx = this.data.resumes.findIndex(r => r.id === id && r.userId === userId);
    if (idx === -1) return false;
    this.data.resumes.splice(idx, 1);
    this.save();
    return true;
  }

  // Applications
  getApplicationsByUser(userId) {
    return this.data.applications.filter(a => a.userId === userId);
  }

  createApplication(appData) {
    const newApp = {
      id: 'app_' + Math.random().toString(36).substring(2, 10),
      createdAt: new Date().toISOString(),
      ...appData
    };
    this.data.applications.push(newApp);
    this.save();
    return newApp;
  }

  updateApplication(id, userId, updates) {
    const idx = this.data.applications.findIndex(a => a.id === id && a.userId === userId);
    if (idx === -1) return null;
    this.data.applications[idx] = {
      ...this.data.applications[idx],
      ...updates
    };
    this.save();
    return this.data.applications[idx];
  }

  deleteApplication(id, userId) {
    const idx = this.data.applications.findIndex(a => a.id === id && a.userId === userId);
    if (idx === -1) return false;
    this.data.applications.splice(idx, 1);
    this.save();
    return true;
  }

  // Job Matches
  saveJobMatch(matchData) {
    const newMatch = {
      id: 'jm_' + Math.random().toString(36).substring(2, 10),
      createdAt: new Date().toISOString(),
      ...matchData
    };
    this.data.jobMatches.push(newMatch);
    this.save();
    return newMatch;
  }

  getJobMatchesByUser(userId) {
    return this.data.jobMatches.filter(m => m.userId === userId);
  }
}

export const db = new Database();
