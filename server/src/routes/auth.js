import express from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = db.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      role: role || 'Student / Fresh Graduate'
    });

    // Automatically create a starter resume for the new user
    db.createResume({
      userId: user.id,
      title: `${user.name}'s Resume`,
      targetRole: user.role || 'Software Engineer',
      templateId: 'modern',
      personalInfo: {
        fullName: user.name,
        title: user.role || 'Software Engineer & CS Graduate',
        email: user.email,
        phone: '+1 (555) 019-2834',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com',
        portfolio: '',
        summary: `Motivated ${user.role || 'Computer Science student'} with a solid foundation in modern web development, algorithms, and software engineering principles. Dedicated to writing clean, maintainable code and solving challenging problems in collaborative agile environments.`
      },
      education: [
        {
          id: 'edu-1',
          institution: 'University / Institute of Technology',
          degree: 'Bachelor of Science / Technology',
          fieldOfStudy: user.role || 'Computer Science & Engineering',
          location: 'City, State',
          startDate: '2022-08',
          endDate: '2026-05',
          gpa: '3.8 / 4.0',
          honors: "Dean's Honor List",
          coursework: 'Data Structures, Operating Systems, Database Management Systems, Cloud Computing'
        }
      ],
      skills: {
        technical: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'Java', 'SQL', 'HTML/CSS'],
        frameworks: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'Tailwind CSS'],
        tools: ['Git & GitHub', 'Docker', 'Postman', 'VS Code', 'MongoDB', 'PostgreSQL'],
        soft: ['Agile / Scrum', 'Problem Solving', 'Technical Communication', 'Team Leadership'],
        languages: ['English (Fluent)']
      },
      projects: [
        {
          id: 'proj-1',
          title: 'CareerCraft AI - Intelligent Career Platform',
          techStack: 'React, Node.js, Express, Tailwind CSS, REST APIs',
          liveUrl: 'https://careercraft-ai-demo.onrender.com',
          githubUrl: 'https://github.com',
          startDate: '2025-08',
          endDate: '2025-12',
          bullets: [
            'Architected a full-stack career acceleration application featuring real-time ATS scoring and AI-driven resume optimization.',
            'Implemented interactive resume templates with instantaneous live preview, reducing resume crafting time by 60%.',
            'Engineered RESTful API endpoints with JWT authentication and secure session management.'
          ]
        }
      ],
      internships: [],
      experience: [],
      certifications: [],
      achievements: [
        {
          id: 'ach-1',
          title: 'University Hackathon Finalist',
          date: '2025-03',
          description: 'Designed and deployed a full-stack web application within a 36-hour sprint.'
        }
      ],
      atsScore: 88,
      resumeScore: 90
    });

    const token = generateToken(user);
    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('[Auth] Register error:', err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Special check for demo seed account fallback
    const isMatch = await bcrypt.compare(password, user.passwordHash) || (email === 'demo@student.edu' && password === 'password123');
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    return res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Demo login (Instant one-click access)
router.post('/demo-login', async (req, res) => {
  try {
    const demoUser = db.getUserByEmail('demo@student.edu');
    if (!demoUser) {
      return res.status(404).json({ error: 'Demo account not found' });
    }
    const token = generateToken(demoUser);
    return res.json({
      message: 'Logged in as Demo User',
      token,
      user: {
        id: demoUser.id,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Demo login failed' });
  }
});

// Get Current User Profile
router.get('/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

export default router;
