import express from 'express';
import multer from 'multer';
import { db } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { calculateAtsScore } from '../aiService.js';
import { parsePdfResume } from '../pdfService.js';

const router = express.Router();
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are supported.'));
    }
  }
});

// Protect all resume routes
router.use(authMiddleware);

// Get all user's resumes
router.get('/', (req, res) => {
  let list = db.getResumesByUser(req.user.id);
  if (!list || list.length === 0) {
    const defaultResume = db.createResume({
      userId: req.user.id,
      title: `${req.user.name || 'Primary'}'s Resume`,
      targetRole: req.user.role || 'Software Engineer',
      templateId: 'modern',
      personalInfo: {
        fullName: req.user.name || 'Student Candidate',
        title: req.user.role || 'Software Engineer & CS Graduate',
        email: req.user.email || '',
        phone: '+1 (555) 019-2834',
        location: 'San Francisco, CA',
        linkedin: 'https://linkedin.com',
        github: 'https://github.com',
        portfolio: '',
        summary: `Motivated ${req.user.role || 'Computer Science student'} with a solid foundation in modern web development, algorithms, and software engineering principles. Dedicated to writing clean, maintainable code and solving challenging problems in collaborative agile environments.`
      },
      education: [
        {
          id: 'edu-1',
          institution: 'University / Institute of Technology',
          degree: 'Bachelor of Science / Technology',
          fieldOfStudy: req.user.role || 'Computer Science & Engineering',
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
    list = [defaultResume];
  }
  res.json({ resumes: list });
});

// Get single resume
router.get('/:id', (req, res) => {
  const resume = db.getResumeById(req.params.id, req.user.id);
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }
  res.json({ resume });
});

// Create new resume
router.post('/', (req, res) => {
  const {
    title = 'Untitled Resume',
    targetRole = 'Software Engineer',
    templateId = 'modern',
    personalInfo = {},
    education = [],
    skills = { technical: [], frameworks: [], tools: [], soft: [], languages: [] },
    projects = [],
    internships = [],
    experience = [],
    certifications = [],
    achievements = []
  } = req.body;

  const atsAnalysis = calculateAtsScore({
    resume: { personalInfo, education, skills, projects, internships, experience },
    targetRole
  });

  const created = db.createResume({
    userId: req.user.id,
    title,
    targetRole,
    templateId,
    personalInfo,
    education,
    skills,
    projects,
    internships,
    experience,
    certifications,
    achievements,
    atsScore: atsAnalysis.totalScore,
    resumeScore: Math.min(100, Math.round(atsAnalysis.totalScore * 1.02))
  });

  res.status(201).json({
    message: 'Resume created successfully',
    resume: created
  });
});

// Update resume
router.put('/:id', (req, res) => {
  const resume = db.getResumeById(req.params.id, req.user.id);
  if (!resume) {
    return res.status(404).json({ error: 'Resume not found' });
  }

  const updates = { ...req.body };
  delete updates.id;
  delete updates.userId;
  delete updates.createdAt;

  // Auto-recalculate ATS score
  const updatedResumePreview = {
    ...resume,
    ...updates
  };
  const atsAnalysis = calculateAtsScore({
    resume: updatedResumePreview,
    targetRole: updatedResumePreview.targetRole
  });

  updates.atsScore = atsAnalysis.totalScore;
  updates.resumeScore = Math.min(100, Math.round(atsAnalysis.totalScore * 1.02));

  const saved = db.updateResume(req.params.id, req.user.id, updates);
  res.json({
    message: 'Resume saved successfully',
    resume: saved,
    atsAnalysis
  });
});

// Delete resume
router.delete('/:id', (req, res) => {
  const success = db.deleteResume(req.params.id, req.user.id);
  if (!success) {
    return res.status(404).json({ error: 'Resume not found' });
  }
  res.json({ message: 'Resume deleted successfully' });
});

// Upload and Parse PDF Resume
router.post('/upload-pdf', upload.single('resumePdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const parseResult = await parsePdfResume(req.file.buffer);
    const parsed = parseResult.parsedData;

    // Calculate initial ATS score for the parsed resume
    const atsAnalysis = calculateAtsScore({
      resume: parsed,
      targetRole: parsed.personalInfo?.title || 'Software Engineer'
    });

    const newResume = db.createResume({
      userId: req.user.id,
      title: `${parsed.personalInfo?.fullName || 'Imported'} - Resume (${req.file.originalname.replace('.pdf', '')})`,
      targetRole: parsed.personalInfo?.title || 'Software Engineer',
      templateId: 'modern',
      personalInfo: parsed.personalInfo || {},
      education: parsed.education || [],
      skills: parsed.skills || { technical: [], frameworks: [], tools: [], soft: [], languages: [] },
      projects: parsed.projects || [],
      internships: parsed.internships || [],
      experience: parsed.experience || [],
      certifications: parsed.certifications || [],
      achievements: parsed.achievements || [],
      atsScore: atsAnalysis.totalScore,
      resumeScore: Math.min(100, Math.round(atsAnalysis.totalScore * 1.02))
    });

    return res.status(201).json({
      message: 'Resume PDF successfully parsed and imported!',
      resume: newResume,
      atsAnalysis
    });
  } catch (err) {
    console.error('[Upload PDF] Error:', err);
    res.status(500).json({ error: err.message || 'Failed to process PDF resume.' });
  }
});

export default router;
