import express from 'express';
import {
  getAiStatus,
  generateSummary,
  improveBulletPoint,
  checkGrammarAndTone,
  analyzeResume,
  calculateAtsScore,
  compareJobDescription,
  suggestProjectsAndSkills,
  generateInterviewPrep,
  chatAssistant
} from '../aiService.js';
import { db } from '../db.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Allow checking status without auth or with auth
router.get('/status', (req, res) => {
  res.json(getAiStatus());
});

// Career Chatbot Assistant (Gemini Powered - works for guest explorers and logged-in candidates)
router.post('/chat', optionalAuthMiddleware, async (req, res) => {
  try {
    const { messages, resume, targetRole } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }
    const result = await chatAssistant({ messages, resume, targetRole });
    res.json(result);
  } catch (err) {
    console.error('[AI] Chat error:', err);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Support both authenticated candidates and guest explorers for AI services
router.use(optionalAuthMiddleware);

// 1. Generate Summary
router.post('/summary', async (req, res) => {
  try {
    const { targetRole, skills, education, experienceLevel, tone } = req.body;
    const result = await generateSummary({ targetRole, skills, education, experienceLevel, tone });
    res.json(result);
  } catch (err) {
    console.error('[AI] Summary error:', err);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// 2. Improve Bullet Point
router.post('/improve-bullet', async (req, res) => {
  try {
    const { text, role, techStack, impact } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Bullet text is required' });
    }
    const result = await improveBulletPoint({ text, role, techStack, impact });
    res.json(result);
  } catch (err) {
    console.error('[AI] Bullet improvement error:', err);
    res.status(500).json({ error: 'Failed to improve bullet' });
  }
});

// 3. Grammar and Tone Check
router.post('/grammar', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required' });
    }
    const result = await checkGrammarAndTone({ text });
    res.json(result);
  } catch (err) {
    console.error('[AI] Grammar check error:', err);
    res.status(500).json({ error: 'Failed to check grammar' });
  }
});

// 4. Analyze Resume
router.post('/analyze-resume', async (req, res) => {
  try {
    const { resume } = req.body;
    if (!resume) {
      return res.status(400).json({ error: 'Resume data is required' });
    }
    const result = await analyzeResume({ resume });
    res.json(result);
  } catch (err) {
    console.error('[AI] Resume analysis error:', err);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

// 5. ATS Score Calculation & Breakdown
router.post('/ats-score', (req, res) => {
  try {
    const { resume, targetRole } = req.body;
    if (!resume) {
      return res.status(400).json({ error: 'Resume data is required' });
    }
    const result = calculateAtsScore({ resume, targetRole });
    res.json(result);
  } catch (err) {
    console.error('[AI] ATS score error:', err);
    res.status(500).json({ error: 'Failed to calculate ATS score' });
  }
});

// 6. Compare Resume against Job Description
router.post('/match-job', async (req, res) => {
  try {
    const { resume, jobDescription, jobTitle, company, saveToHistory } = req.body;
    if (!resume || !jobDescription) {
      return res.status(400).json({ error: 'Both resume and jobDescription are required' });
    }

    const comparison = await compareJobDescription({ resume, jobDescription, jobTitle });

    // Also get project & skill recommendations based on the missing skills
    const missingSkillsList = [
      ...(comparison.missingKeywords?.critical || []),
      ...(comparison.missingKeywords?.niceToHave || [])
    ];

    const upskilling = await suggestProjectsAndSkills({
      missingSkills: missingSkillsList,
      targetRole: jobTitle || 'Software Engineer',
      currentSkills: comparison.matchedKeywords || []
    });

    const combinedResult = {
      ...comparison,
      upskillingPlan: upskilling
    };

    if (saveToHistory && req.user) {
      db.saveJobMatch({
        userId: req.user.id,
        resumeId: resume.id,
        jobTitle: jobTitle || 'Software Engineer',
        company: company || 'Prospective Employer',
        jobDescription,
        matchScore: comparison.matchScore,
        matchedKeywords: comparison.matchedKeywords,
        missingKeywords: missingSkillsList,
        recommendations: comparison.tailoringTips?.map(t => t.tip) || [],
        projectSuggestions: upskilling.suggestedProjects || []
      });
    }

    res.json(combinedResult);
  } catch (err) {
    console.error('[AI] Job match error:', err);
    res.status(500).json({ error: 'Failed to compare job description' });
  }
});

// 7. Suggest Projects & Skills to Learn
router.post('/suggest-projects', async (req, res) => {
  try {
    const { missingSkills, targetRole, currentSkills } = req.body;
    const result = await suggestProjectsAndSkills({ missingSkills, targetRole, currentSkills });
    res.json(result);
  } catch (err) {
    console.error('[AI] Project suggestions error:', err);
    res.status(500).json({ error: 'Failed to generate project suggestions' });
  }
});

// 8. Generate Tailored Interview Preparation Questions
router.post('/interview-prep', async (req, res) => {
  try {
    const { resume, targetRole } = req.body;
    if (!resume) {
      return res.status(400).json({ error: 'Resume data is required' });
    }
    const result = await generateInterviewPrep({ resume, targetRole });
    res.json(result);
  } catch (err) {
    console.error('[AI] Interview prep error:', err);
    res.status(500).json({ error: 'Failed to generate interview questions' });
  }
});

export default router;
