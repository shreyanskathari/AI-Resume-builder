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
  const list = db.getResumesByUser(req.user.id);
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
