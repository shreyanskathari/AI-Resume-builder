import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  ShieldCheck,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Briefcase,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Code,
  Layers,
  Award,
  Zap,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard({
  onNavigate,
  onOpenPdfModal,
  onOpenAtsModal,
  resume,
  setResume
}) {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [atsAnalysis, setAtsAnalysis] = useState(null);

  useEffect(() => {
    api.getApplications()
      .then(apps => setApplications(apps || []))
      .catch(console.error);

    if (resume) {
      api.getAtsScore(resume, resume.targetRole)
        .then(res => setAtsAnalysis(res))
        .catch(console.error);
    }
  }, [resume]);

  const atsScore = resume?.atsScore || 92;
  const resumeScore = resume?.resumeScore || 94;

  const getScoreColor = (val) => {
    if (val >= 85) return 'text-emerald-500 stroke-emerald-500';
    if (val >= 70) return 'text-blue-500 stroke-blue-500';
    return 'text-amber-500 stroke-amber-500';
  };

  const allSkills = [
    ...(resume?.skills?.technical || []),
    ...(resume?.skills?.frameworks || []),
    ...(resume?.skills?.tools || [])
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.07 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8"
    >
      
      {/* Welcome Hero Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-600 p-6 sm:p-8 text-white shadow-xl hover:shadow-2xl transition-shadow"
      >
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md mb-3">
            <Zap className="h-3.5 w-3.5 text-yellow-300 animate-pulse" />
            <span>AI Career Accelerator for Fresh Graduates & Students</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Welcome back, {user?.name || 'Alex'}! 👋
          </h1>
          <p className="mt-2 text-xs sm:text-base text-blue-100 leading-relaxed max-w-2xl">
            Your resume is optimized for applicant tracking systems. Tailor it to specific roles, polish your bullet points with the STAR method, and practice technical questions to land high-paying engineering offers.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('builder')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <FileText className="h-4 w-4" />
              Edit Resume in Studio
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenPdfModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-800/60 hover:bg-blue-800/80 text-white text-xs sm:text-sm font-semibold border border-blue-400/40 backdrop-blur-sm transition-all"
            >
              <UploadCloud className="h-4 w-4" />
              Import PDF Resume
            </motion.button>
          </div>
        </div>

        {/* Decorative background glow with float animation */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-400/25 rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="absolute right-40 -top-20 w-60 h-60 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />
      </motion.div>

      {/* Primary KPI & Scores Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* ATS Compatibility Score Card */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          onClick={onOpenAtsModal}
          className="cursor-pointer p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              ATS Compatibility
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center shrink-0">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-800 stroke-current"
                  strokeWidth="3.8"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: atsScore / 100 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className={`${getScoreColor(atsScore)}`}
                  strokeDasharray="100, 100"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-sm font-black text-slate-900 dark:text-white">
                {atsScore}
              </span>
            </div>

            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Grade A+ • Top 8%
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Machine parsable structure
              </p>
            </div>
          </div>

          <div className="mt-3 text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            View Factor Breakdown <ChevronRight className="h-3 w-3" />
          </div>
        </motion.div>

        {/* Content Impact Score */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Content & Metrics
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center shrink-0">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-slate-100 dark:text-slate-800 stroke-current"
                  strokeWidth="3.8"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: resumeScore / 100 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="stroke-blue-500"
                  strokeDasharray="100, 100"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-sm font-black text-slate-900 dark:text-white">
                {resumeScore}
              </span>
            </div>

            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Quantified Impact
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Action verb & metric density
              </p>
            </div>
          </div>

          <div className="mt-3 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> STAR Formula Verified
          </div>
        </motion.div>

        {/* Skills Indexed */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Parsed Tech Skills
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <Code className="h-4 w-4" />
            </div>
          </div>

          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {allSkills.length} Keywords
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Languages, frameworks, databases & tools
          </p>

          <div className="mt-3 text-[11px] font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1">
            <Layers className="h-3 w-3" /> 4 Categories Populated
          </div>
        </motion.div>

        {/* Applications Tracked */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          onClick={() => onNavigate('applications')}
          className="cursor-pointer p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Job Pipeline
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>

          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {applications.length} Saved Roles
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            {applications.filter(a => a.status === 'Interviewing').length} currently interviewing
          </p>

          <div className="mt-3 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Manage Tracker <ChevronRight className="h-3 w-3" />
          </div>
        </motion.div>

      </motion.div>

      {/* Middle Section: Recommended Improvements & Skills Cloud */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recommended Improvements (Left 7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500 animate-pulse" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recommended AI Improvements
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              3 High-Priority Actions
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                priority: 'High Priority',
                title: 'Quantify PulseStream Project Latency & Concurrency',
                desc: 'Add exact numbers for active WebSocket connections or millisecond latency reductions in your PulseStream project.',
                action: 'Polish with STAR',
                target: 'builder'
              },
              {
                priority: 'Medium Priority',
                title: 'Add Distributed Messaging Keywords (Kafka / Redis)',
                desc: 'Job descriptions for entry-level Software Engineers frequently screen for asynchronous message brokers and caching.',
                action: 'Scan with Job Matcher',
                target: 'matcher'
              },
              {
                priority: 'Low Priority',
                title: 'Practice Behavioral Questions on Team Conflict',
                desc: 'Prepare your STAR narrative for the standard hackathon technical disagreement scenario before upcoming interviews.',
                action: 'Start Interview Prep',
                target: 'interview'
              }
            ].map((rec, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.01, x: 3 }}
                transition={{ duration: 0.15 }}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      rec.priority.includes('High')
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : rec.priority.includes('Medium')
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    }`}>
                      {rec.priority}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {rec.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
                    {rec.desc}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => onNavigate(rec.target)}
                  className="self-start sm:self-auto shrink-0 flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                >
                  {rec.action} <ArrowRight className="h-3 w-3" />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skills Inventory & Quick Badges (Right 5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Categorized Skills
            </h3>
            <button
              onClick={() => onNavigate('builder')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Edit in Builder
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {resume?.skills?.technical?.length > 0 && (
              <div>
                <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px] mb-1.5">
                  Languages
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.technical.map((s, idx) => (
                    <motion.span
                      key={idx}
                      whileHover={{ scale: 1.08 }}
                      className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-medium cursor-default shadow-2xs"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {resume?.skills?.frameworks?.length > 0 && (
              <div>
                <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px] mb-1.5">
                  Frameworks & Libraries
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.frameworks.map((s, idx) => (
                    <motion.span
                      key={idx}
                      whileHover={{ scale: 1.08 }}
                      className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 font-medium cursor-default shadow-2xs"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {resume?.skills?.tools?.length > 0 && (
              <div>
                <span className="font-semibold text-slate-500 uppercase tracking-wider block text-[10px] mb-1.5">
                  Cloud & Developer Tools
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {resume.skills.tools.map((s, idx) => (
                    <motion.span
                      key={idx}
                      whileHover={{ scale: 1.08 }}
                      className="px-2.5 py-1 rounded-md bg-cyan-50 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300 font-medium cursor-default shadow-2xs"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </motion.div>

      {/* Bottom Section: Recent Applications Tracker Preview */}
      <motion.div
        variants={itemVariants}
        className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-600" />
              Recent Job Applications
            </h3>
            <p className="text-xs text-slate-500">Live tracker for student internships and graduate roles.</p>
          </div>

          <button
            onClick={() => onNavigate('applications')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 group"
          >
            View All ({applications.length}) <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {applications.slice(0, 3).map((app) => (
            <motion.div
              key={app.id}
              whileHover={{ y: -3 }}
              className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 space-y-2 hover:border-slate-300 transition-colors shadow-2xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{app.position}</h4>
                  <p className="text-xs font-medium text-slate-500">{app.company}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  app.status === 'Offered'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : app.status === 'Interviewing'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                }`}>
                  {app.status}
                </span>
              </div>
              {app.notes && (
                <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1">
                  {app.notes}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}
