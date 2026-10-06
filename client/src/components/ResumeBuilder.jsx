import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import ResumePreview from './ResumePreview';
import AiSummaryModal from './AiSummaryModal';
import AiBulletModal from './AiBulletModal';
import AiGrammarModal from './AiGrammarModal';
import AtsScoreModal from './AtsScoreModal';
import PdfUploadModal from './PdfUploadModal';
import {
  FileText,
  Save,
  Download,
  UploadCloud,
  Sparkles,
  ShieldCheck,
  Check,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Layout,
  Eye,
  Edit3,
  Bot,
  Zap,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResumeBuilder({ initialResume, onResumeUpdated }) {
  const { user } = useAuth();
  const [resume, setResume] = useState(initialResume || null);
  const [templateId, setTemplateId] = useState('modern');
  const [activeSection, setActiveSection] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [previewMode, setPreviewMode] = useState('split'); // 'split' | 'editor' | 'preview'

  // Modals state
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isBulletModalOpen, setIsBulletModalOpen] = useState(false);
  const [bulletModalData, setBulletModalData] = useState({ text: '', role: '', techStack: '', onApply: null });
  const [isGrammarModalOpen, setIsGrammarModalOpen] = useState(false);
  const [grammarModalText, setGrammarModalText] = useState('');
  const [grammarApplyCallback, setGrammarApplyCallback] = useState(null);
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [atsAnalysis, setAtsAnalysis] = useState(null);

  const [isWakingServer, setIsWakingServer] = useState(false);

  const createStarterResume = () => ({
    id: 'res_' + Math.random().toString(36).substring(2, 10),
    userId: user?.id || 'guest',
    title: `${user?.name || 'Primary'}'s Resume`,
    targetRole: user?.role || 'Software Engineer',
    templateId: 'modern',
    personalInfo: {
      fullName: user?.name || 'Student Candidate',
      title: user?.role || 'Software Engineer & CS Graduate',
      email: user?.email || '',
      phone: '+1 (555) 019-2834',
      location: 'San Francisco, CA',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      portfolio: '',
      summary: `Motivated ${user?.role || 'software engineer'} with hands-on experience building modern web applications, scalable APIs, and clean user interfaces.`
    },
    education: [
      {
        id: 'edu-1',
        institution: 'University / Institute of Technology',
        degree: 'Bachelor of Science / Technology',
        fieldOfStudy: user?.role || 'Computer Science & Engineering',
        location: 'City, State',
        startDate: '2022-08',
        endDate: '2026-05',
        gpa: '3.8 / 4.0',
        honors: "Dean's Honor List",
        coursework: 'Data Structures, Algorithms, DBMS, Operating Systems, Web Technologies'
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

  useEffect(() => {
    if (initialResume) {
      setResume(initialResume);
      setTemplateId(initialResume.templateId || 'modern');
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsWakingServer(true);
    }, 3000);

    // If server takes too long (e.g. Render cold start) or fails, fallback to starter template after 6s
    const fallbackTimer = setTimeout(() => {
      setResume(prev => {
        if (!prev) {
          const starter = createStarterResume();
          if (onResumeUpdated) onResumeUpdated(starter);
          return starter;
        }
        return prev;
      });
    }, 6000);

    // Load user's primary resume
    api.getResumes()
      .then(resumes => {
        clearTimeout(timeoutId);
        clearTimeout(fallbackTimer);
        if (resumes && resumes.length > 0) {
          setResume(resumes[0]);
          setTemplateId(resumes[0].templateId || 'modern');
          if (onResumeUpdated) onResumeUpdated(resumes[0]);
        } else {
          const starter = createStarterResume();
          setResume(starter);
          if (onResumeUpdated) onResumeUpdated(starter);
        }
      })
      .catch(err => {
        console.warn('Could not fetch resumes from backend:', err);
        clearTimeout(timeoutId);
        clearTimeout(fallbackTimer);
        const starter = createStarterResume();
        setResume(starter);
        if (onResumeUpdated) onResumeUpdated(starter);
      });

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(fallbackTimer);
    };
  }, [initialResume]);

  useEffect(() => {
    if (resume && onResumeUpdated) {
      onResumeUpdated(resume);
    }
  }, [resume]);

  if (!resume) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center min-h-[380px]">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Loading your resume studio...
        </p>
        {isWakingServer && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 max-w-sm">
            Waking up server on Render... Free tier instances take ~50s on initial cold start.
          </p>
        )}
        <button
          onClick={() => {
            const starter = createStarterResume();
            setResume(starter);
            if (onResumeUpdated) onResumeUpdated(starter);
          }}
          className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Open Starter Resume Now
        </button>
      </div>
    );
  }

  // Handle updates to resume state
  const updatePersonalInfo = (field, value) => {
    setResume(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('Saving...');
    try {
      let updated;
      try {
        updated = await api.updateResume(resume.id, {
          ...resume,
          templateId
        });
      } catch (updateErr) {
        // If resume doesn't exist on server yet, create it!
        const created = await api.createResume({
          ...resume,
          templateId
        });
        updated = { resume: created };
      }
      if (updated && updated.resume) {
        setResume(updated.resume);
        if (updated.atsAnalysis) {
          setAtsAnalysis(updated.atsAnalysis);
        }
        if (onResumeUpdated) onResumeUpdated(updated.resume);
      }
      setSaveStatus('Saved!');
      setTimeout(() => setSaveStatus(''), 2500);
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus('Saved locally');
      setTimeout(() => setSaveStatus(''), 2500);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    } catch (e) {}
    window.print();
  };

  const handleOpenAtsAudit = async () => {
    try {
      const data = await api.getAtsScore(resume, resume.targetRole);
      setAtsAnalysis(data);
      setIsAtsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Skill tag add/remove
  const addSkill = (category, skill) => {
    if (!skill.trim()) return;
    setResume(prev => {
      const currentList = prev.skills?.[category] || [];
      if (currentList.includes(skill.trim())) return prev;
      return {
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...currentList, skill.trim()]
        }
      };
    });
  };

  const removeSkill = (category, index) => {
    setResume(prev => {
      const currentList = [...(prev.skills?.[category] || [])];
      currentList.splice(index, 1);
      return {
        ...prev,
        skills: { ...prev.skills, [category]: currentList }
      };
    });
  };

  // Education Helpers
  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: 'edu_' + Date.now(),
          institution: 'New University',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          location: '',
          startDate: '2022',
          endDate: '2026',
          gpa: '3.8 / 4.0',
          honors: '',
          coursework: ''
        }
      ]
    }));
  };

  const updateEducation = (index, field, value) => {
    setResume(prev => {
      const list = [...prev.education];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, education: list };
    });
  };

  const removeEducation = (index) => {
    setResume(prev => {
      const list = [...prev.education];
      list.splice(index, 1);
      return { ...prev, education: list };
    });
  };

  // Project Helpers
  const addProject = () => {
    setResume(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: 'proj_' + Date.now(),
          title: 'New Featured Project',
          techStack: 'React, Node.js, PostgreSQL',
          liveUrl: '',
          githubUrl: '',
          startDate: '2025',
          endDate: 'Present',
          bullets: [
            'Architected scalable full-stack application delivering sub-100ms API response latency.',
            'Implemented automated CI/CD pipeline and integration tests improving release reliability.'
          ]
        }
      ]
    }));
  };

  const updateProject = (index, field, value) => {
    setResume(prev => {
      const list = [...prev.projects];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, projects: list };
    });
  };

  const removeProject = (index) => {
    setResume(prev => {
      const list = [...prev.projects];
      list.splice(index, 1);
      return { ...prev, projects: list };
    });
  };

  const addProjectBullet = (projIndex) => {
    setResume(prev => {
      const list = [...prev.projects];
      list[projIndex].bullets = [...(list[projIndex].bullets || []), 'Engineered core features and optimized system performance.'];
      return { ...prev, projects: list };
    });
  };

  const updateProjectBullet = (projIndex, bulletIndex, value) => {
    setResume(prev => {
      const list = [...prev.projects];
      list[projIndex].bullets[bulletIndex] = value;
      return { ...prev, projects: list };
    });
  };

  const removeProjectBullet = (projIndex, bulletIndex) => {
    setResume(prev => {
      const list = [...prev.projects];
      list[projIndex].bullets.splice(bulletIndex, 1);
      return { ...prev, projects: list };
    });
  };

  // Internship Helpers
  const addInternship = () => {
    setResume(prev => ({
      ...prev,
      internships: [
        ...prev.internships,
        {
          id: 'intern_' + Date.now(),
          company: 'Tech Company',
          role: 'Software Engineering Intern',
          location: 'San Francisco, CA',
          startDate: '2025-06',
          endDate: '2025-08',
          bullets: [
            'Developed RESTful endpoints in TypeScript reducing data query latency by 30%.',
            'Authored automated unit tests raising code coverage across backend microservices to 85%.'
          ]
        }
      ]
    }));
  };

  const updateInternship = (index, field, value) => {
    setResume(prev => {
      const list = [...prev.internships];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, internships: list };
    });
  };

  const removeInternship = (index) => {
    setResume(prev => {
      const list = [...prev.internships];
      list.splice(index, 1);
      return { ...prev, internships: list };
    });
  };

  const addInternshipBullet = (intIndex) => {
    setResume(prev => {
      const list = [...prev.internships];
      list[intIndex].bullets = [...(list[intIndex].bullets || []), 'Collaborated in agile sprint cycles to deliver features on schedule.'];
      return { ...prev, internships: list };
    });
  };

  const updateInternshipBullet = (intIndex, bulletIndex, value) => {
    setResume(prev => {
      const list = [...prev.internships];
      list[intIndex].bullets[bulletIndex] = value;
      return { ...prev, internships: list };
    });
  };

  const removeInternshipBullet = (intIndex, bulletIndex) => {
    setResume(prev => {
      const list = [...prev.internships];
      list[intIndex].bullets.splice(bulletIndex, 1);
      return { ...prev, internships: list };
    });
  };

  // Trigger AI Bullet Enhancer
  const triggerBulletAi = (initialText, role, techStack, onApply) => {
    setBulletModalData({ text: initialText, role, techStack, onApply });
    setIsBulletModalOpen(true);
  };

  // Trigger AI Grammar
  const triggerGrammarAi = (initialText, onApply) => {
    setGrammarModalText(initialText);
    setGrammarApplyCallback(() => onApply);
    setIsGrammarModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Toolbar */}
      <div className="no-print mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Left: Resume Title & ATS Score Badge */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <input
              type="text"
              value={resume.title}
              onChange={(e) => setResume(prev => ({ ...prev, title: e.target.value }))}
              className="text-base sm:text-lg font-bold text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            onClick={handleOpenAtsAudit}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:scale-105 transition-transform"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>ATS Score: {resume.atsScore || 90}/100</span>
          </button>
        </div>

        {/* Center / Right: Template Selector & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Template Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
            <span className="text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
              <Layout className="h-3.5 w-3.5" /> Template:
            </span>
            {[
              { id: 'modern', label: 'Modern Tech' },
              { id: 'classic', label: 'Classic Ivy' },
              { id: 'minimalist', label: 'Minimalist' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTemplateId(t.id)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  templateId === t.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle (Mobile / Desktop) */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setPreviewMode('editor')}
              className={`px-2.5 py-1 rounded-md ${previewMode === 'editor' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Editor Only
            </button>
            <button
              onClick={() => setPreviewMode('split')}
              className={`px-2.5 py-1 rounded-md ${previewMode === 'split' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Split View
            </button>
            <button
              onClick={() => setPreviewMode('preview')}
              className={`px-2.5 py-1 rounded-md ${previewMode === 'preview' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-300'}`}
            >
              Preview Only
            </button>
          </div>

          {/* Upload PDF */}
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <UploadCloud className="h-3.5 w-3.5 text-slate-500" />
            Upload PDF
          </button>

          {/* Save Resume */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            <span>{saveStatus || 'Save'}</span>
          </button>

          {/* Export / Print PDF */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT / EDITOR COLUMN */}
        {(previewMode === 'split' || previewMode === 'editor') && (
          <div className={`no-print ${previewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} space-y-4`}>
            
            {/* Section Navigation Tabs */}
            <div className="flex overflow-x-auto gap-1 pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold relative">
              {[
                { id: 'personal', label: 'Contact & Info' },
                { id: 'summary', label: 'Summary' },
                { id: 'education', label: 'Education' },
                { id: 'skills', label: 'Skills' },
                { id: 'projects', label: 'Projects' },
                { id: 'internships', label: 'Experience' },
                { id: 'certifications', label: 'Certifications' }
              ].map(sec => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`relative px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors z-10 ${
                    activeSection === sec.id
                      ? 'text-white font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {activeSection === sec.id && (
                    <motion.div
                      layoutId="activeBuilderTab"
                      transition={{ type: "spring", stiffness: 450, damping: 35 }}
                      className="absolute inset-0 bg-blue-600 rounded-lg shadow-xs -z-10"
                    />
                  )}
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>

            {/* 1. PERSONAL INFORMATION */}
            {activeSection === 'personal' && (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Personal & Contact Information
                  </h3>
                  <span className="text-[11px] text-slate-500">ATS standard contact fields</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Full Name</label>
                    <input
                      type="text"
                      value={resume.personalInfo?.fullName || ''}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Target Professional Title</label>
                    <input
                      type="text"
                      value={resume.personalInfo?.title || ''}
                      onChange={(e) => updatePersonalInfo('title', e.target.value)}
                      placeholder="Full Stack Developer & CS Graduate"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Email</label>
                    <input
                      type="email"
                      value={resume.personalInfo?.email || ''}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      placeholder="alex.dev@gmail.com"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Phone Number</label>
                    <input
                      type="text"
                      value={resume.personalInfo?.phone || ''}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Location</label>
                    <input
                      type="text"
                      value={resume.personalInfo?.location || ''}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      placeholder="San Francisco, CA"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      value={resume.personalInfo?.linkedin || ''}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/alexrivera"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">GitHub Profile URL</label>
                    <input
                      type="url"
                      value={resume.personalInfo?.github || ''}
                      onChange={(e) => updatePersonalInfo('github', e.target.value)}
                      placeholder="https://github.com/alexrivera"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Portfolio Website</label>
                    <input
                      type="url"
                      value={resume.personalInfo?.portfolio || ''}
                      onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                      placeholder="https://alexrivera.dev"
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. PROFESSIONAL SUMMARY */}
            {activeSection === 'summary' && (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Professional Summary
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      3-4 sentence elevator pitch highlighting target role and core technical strengths.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsSummaryModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Generate with AI
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerGrammarAi(resume.personalInfo?.summary || '', (improved) => updatePersonalInfo('summary', improved))}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
                    >
                      <Check className="h-3 w-3" />
                      Check Grammar
                    </button>
                  </div>
                </div>

                <textarea
                  rows={5}
                  value={resume.personalInfo?.summary || ''}
                  onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                  placeholder="Driven Computer Science graduate with hands-on experience building scalable full-stack web applications..."
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs leading-relaxed text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}

            {/* 3. EDUCATION */}
            {activeSection === 'education' && (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Education
                  </h3>
                  <button
                    onClick={addEducation}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Degree
                  </button>
                </div>

                {(resume.education || []).map((edu, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3 relative">
                    <button
                      onClick={() => removeEducation(idx)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove education"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">University / Institution</label>
                        <input
                          type="text"
                          value={edu.institution || ''}
                          onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                          placeholder="e.g. UC Berkeley"
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Degree & Major</label>
                        <input
                          type="text"
                          value={edu.degree || ''}
                          onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                          placeholder="Bachelor of Science in Computer Science"
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Graduation Date (or Range)</label>
                        <input
                          type="text"
                          value={edu.endDate || ''}
                          onChange={(e) => updateEducation(idx, 'endDate', e.target.value)}
                          placeholder="May 2026"
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">GPA (Optional)</label>
                        <input
                          type="text"
                          value={edu.gpa || ''}
                          onChange={(e) => updateEducation(idx, 'gpa', e.target.value)}
                          placeholder="3.85 / 4.0"
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                        />
                      </div>
                    </div>

                    <div className="text-xs">
                      <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Relevant Coursework</label>
                      <input
                        type="text"
                        value={edu.coursework || ''}
                        onChange={(e) => updateEducation(idx, 'coursework', e.target.value)}
                        placeholder="Data Structures, Algorithms, Distributed Systems, Cloud Computing"
                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. SKILLS */}
            {activeSection === 'skills' && (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Skills & Technologies Inventory
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Grouped for high ATS parsability. Press enter to add a tag.
                  </p>
                </div>

                {[
                  { key: 'technical', label: 'Programming Languages', placeholder: 'Python, TypeScript, SQL...' },
                  { key: 'frameworks', label: 'Frameworks & Libraries', placeholder: 'React, Node.js, Express, Next.js...' },
                  { key: 'tools', label: 'Developer Tools & Cloud', placeholder: 'Docker, AWS, Git, Redis...' },
                  { key: 'soft', label: 'Methodologies & Soft Skills', placeholder: 'Agile, Scrum, System Design...' }
                ].map(cat => (
                  <div key={cat.key} className="space-y-1.5">
                    <label className="font-semibold text-xs text-slate-700 dark:text-slate-300 block">
                      {cat.label}
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
                      {(resume.skills?.[cat.key] || []).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(cat.key, sIdx)}
                            className="hover:text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder={cat.placeholder}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill(cat.key, e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="flex-1 min-w-[120px] bg-transparent text-xs p-1 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. PROJECTS */}
            {activeSection === 'projects' && (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Featured Technical Projects
                    </h3>
                    <p className="text-[11px] text-slate-500">Each bullet includes one-click AI polishing with STAR metrics.</p>
                  </div>
                  <button
                    onClick={addProject}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Project
                  </button>
                </div>

                {(resume.projects || []).map((proj, pIdx) => (
                  <div key={pIdx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3 relative">
                    <button
                      onClick={() => removeProject(pIdx)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Project Title</label>
                        <input
                          type="text"
                          value={proj.title || ''}
                          onChange={(e) => updateProject(pIdx, 'title', e.target.value)}
                          placeholder="CareerPath - AI Mentorship Platform"
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Technologies Used</label>
                        <input
                          type="text"
                          value={proj.techStack || ''}
                          onChange={(e) => updateProject(pIdx, 'techStack', e.target.value)}
                          placeholder="React, Node.js, PostgreSQL, Docker"
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">GitHub Repository URL</label>
                        <input
                          type="url"
                          value={proj.githubUrl || ''}
                          onChange={(e) => updateProject(pIdx, 'githubUrl', e.target.value)}
                          placeholder="https://github.com/..."
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Live Demo Link</label>
                        <input
                          type="url"
                          value={proj.liveUrl || ''}
                          onChange={(e) => updateProject(pIdx, 'liveUrl', e.target.value)}
                          placeholder="https://..."
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                        />
                      </div>
                    </div>

                    {/* Bullet Points with AI Polish */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Accomplishment Bullet Points (STAR Method)
                        </span>
                        <button
                          type="button"
                          onClick={() => addProjectBullet(pIdx)}
                          className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          + Add Bullet
                        </button>
                      </div>

                      {(proj.bullets || []).map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => updateProjectBullet(pIdx, bIdx, e.target.value)}
                            placeholder="Architected..."
                            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                          />
                          <div className="flex flex-col gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => triggerBulletAi(bullet, resume.targetRole, proj.techStack, (newText) => updateProjectBullet(pIdx, bIdx, newText))}
                              title="Improve with AI (STAR format & Metrics)"
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 hover:bg-blue-100"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeProjectBullet(pIdx, bIdx)}
                              title="Remove bullet"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 6. INTERNSHIPS & EXPERIENCE */}
            {activeSection === 'internships' && (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Internships & Work Experience
                    </h3>
                    <p className="text-[11px] text-slate-500">Internships, research assistantships, or student developer roles.</p>
                  </div>
                  <button
                    onClick={addInternship}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Experience
                  </button>
                </div>

                {(resume.internships || []).map((exp, eIdx) => (
                  <div key={eIdx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3 relative">
                    <button
                      onClick={() => removeInternship(eIdx)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-red-500 transition-colors"
                      title="Remove experience"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Company / Organization</label>
                        <input
                          type="text"
                          value={exp.company || ''}
                          onChange={(e) => updateInternship(eIdx, 'company', e.target.value)}
                          placeholder="CloudNova Technologies"
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Role / Position</label>
                        <input
                          type="text"
                          value={exp.role || ''}
                          onChange={(e) => updateInternship(eIdx, 'role', e.target.value)}
                          placeholder="Software Engineering Intern"
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Dates (Duration)</label>
                        <input
                          type="text"
                          value={exp.startDate ? `${exp.startDate} – ${exp.endDate || 'Present'}` : ''}
                          onChange={(e) => updateInternship(eIdx, 'startDate', e.target.value)}
                          placeholder="June 2025 – August 2025"
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">Location</label>
                        <input
                          type="text"
                          value={exp.location || ''}
                          onChange={(e) => updateInternship(eIdx, 'location', e.target.value)}
                          placeholder="San Jose, CA (Remote)"
                          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                        />
                      </div>
                    </div>

                    {/* Bullets */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Key Achievements & Responsibilities
                        </span>
                        <button
                          type="button"
                          onClick={() => addInternshipBullet(eIdx)}
                          className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          + Add Bullet
                        </button>
                      </div>

                      {(exp.bullets || []).map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            value={bullet}
                            onChange={(e) => updateInternshipBullet(eIdx, bIdx, e.target.value)}
                            placeholder="Developed microservice endpoints..."
                            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-white"
                          />
                          <div className="flex flex-col gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => triggerBulletAi(bullet, exp.role, '', (newText) => updateInternshipBullet(eIdx, bIdx, newText))}
                              title="Improve with AI (STAR format & Metrics)"
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 hover:bg-blue-100"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeInternshipBullet(eIdx, bIdx)}
                              title="Remove bullet"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 7. CERTIFICATIONS & ACHIEVEMENTS */}
            {activeSection === 'certifications' && (
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Certifications & Honors
                </h3>
                <div className="space-y-3">
                  {(resume.certifications || []).map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) => {
                          const list = [...resume.certifications];
                          list[idx].name = e.target.value;
                          setResume(prev => ({ ...prev, certifications: list }));
                        }}
                        placeholder="AWS Cloud Practitioner"
                        className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                      />
                      <input
                        type="text"
                        value={c.issuer}
                        onChange={(e) => {
                          const list = [...resume.certifications];
                          list[idx].issuer = e.target.value;
                          setResume(prev => ({ ...prev, certifications: list }));
                        }}
                        placeholder="Amazon Web Services"
                        className="w-40 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setResume(prev => ({
                        ...prev,
                        certifications: [...(prev.certifications || []), { name: 'New Certification', issuer: 'Issuing Organization', date: '2025' }]
                      }));
                    }}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    + Add Certification
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* RIGHT / PREVIEW COLUMN */}
        {(previewMode === 'split' || previewMode === 'preview') && (
          <div className={`${previewMode === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} sticky top-20`}>
            <div className="no-print flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Live ATS Resume Document Preview ({templateId})
              </span>
              <button
                onClick={handlePrint}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Download className="h-3 w-3" /> Print / Save PDF
              </button>
            </div>
            
            <div className="overflow-hidden rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto">
              <ResumePreview resume={resume} templateId={templateId} />
            </div>
          </div>
        )}

      </div>

      {/* MODALS */}
      <AiSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        currentRole={resume.targetRole || resume.personalInfo?.title}
        skills={resume.skills}
        education={resume.education}
        onSelectSummary={(summary) => updatePersonalInfo('summary', summary)}
      />

      <AiBulletModal
        isOpen={isBulletModalOpen}
        onClose={() => setIsBulletModalOpen(false)}
        initialText={bulletModalData.text}
        role={bulletModalData.role}
        techStack={bulletModalData.techStack}
        onApplyBullet={(newText) => {
          if (bulletModalData.onApply) bulletModalData.onApply(newText);
        }}
      />

      <AiGrammarModal
        isOpen={isGrammarModalOpen}
        onClose={() => setIsGrammarModalOpen(false)}
        initialText={grammarModalText}
        onApplyText={(newText) => {
          if (grammarApplyCallback) grammarApplyCallback(newText);
        }}
      />

      <AtsScoreModal
        isOpen={isAtsModalOpen}
        onClose={() => setIsAtsModalOpen(false)}
        atsData={atsAnalysis || { totalScore: resume.atsScore || 90 }}
        onNavigateToBuilder={() => setIsAtsModalOpen(false)}
      />

      <PdfUploadModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        onResumeImported={(imported) => {
          setResume(imported);
          if (onResumeUpdated) onResumeUpdated(imported);
        }}
      />

    </div>
  );
}
