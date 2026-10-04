import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  Sparkles,
  MessageSquare,
  Code,
  Users,
  CheckCircle2,
  HelpCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Loader2,
  BookOpen,
  ChevronRight,
  Flame,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InterviewPrep({ currentResume }) {
  const [activeCategory, setActiveCategory] = useState('projects'); // 'projects' | 'technical' | 'hr'
  const [loading, setLoading] = useState(false);
  const [interviewData, setInterviewData] = useState(null);
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [practiceNotes, setPracticeNotes] = useState({});

  useEffect(() => {
    if (currentResume) {
      loadQuestions();
    }
  }, [currentResume]);

  const loadQuestions = async () => {
    if (!currentResume) return;
    setLoading(true);
    try {
      const data = await api.getInterviewPrep(currentResume, currentResume.targetRole || 'Software Engineer');
      setInterviewData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswer = (key) => {
    setRevealedAnswers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updatePracticeNote = (key, text) => {
    setPracticeNotes(prev => ({ ...prev, [key]: text }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Technical & HR Interview Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Resume-Grounded Interview Preparation
          </h1>
          <p className="text-xs sm:text-sm text-purple-100 max-w-2xl mt-1">
            Practice answering behavioral, technical, and project deep-dive questions generated directly from your projects, tech stack, and experience.
          </p>
        </div>

        <button
          onClick={loadQuestions}
          disabled={loading}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-white text-purple-700 hover:bg-purple-50 shadow-md transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Regenerate Questions
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold relative">
        {[
          { id: 'projects', label: 'Resume & Project Deep Dives', icon: Flame },
          { id: 'technical', label: 'Technical & CS Fundamentals', icon: Code },
          { id: 'hr', label: 'HR & Behavioral (STAR Method)', icon: Users }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-colors z-10 ${
                isActive
                  ? 'text-white font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeInterviewPill"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  className="absolute inset-0 bg-purple-600 rounded-xl shadow-xs -z-10"
                />
              )}
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Synthesizing Tailored Interview Questions...
          </div>
          <p className="text-xs text-slate-500">
            Analyzing your resume projects, database schemas, and engineering competencies to formulate interviewer questions.
          </p>
        </div>
      )}

      {!loading && interviewData && (
        <div className="space-y-4">
          
          {/* 1. PROJECT DEEP DIVES */}
          {activeCategory === 'projects' && (
            <div className="space-y-4">
              {(interviewData.projectDeepDives || []).map((q, idx) => {
                const isRevealed = revealedAnswers[`proj_${idx}`];
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-lg">
                        Project: {q.projectTitle}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        Question {idx + 1}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      "{q.question}"
                    </h3>

                    {/* What interviewer evaluates */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                      <div className="font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                        🎯 What the Interviewer Evaluates:
                      </div>
                      <div className="text-slate-600 dark:text-slate-400">
                        {q.evaluating}
                      </div>
                    </div>

                    {/* Recommended answering strategy */}
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-purple-600 dark:text-purple-400">Strategy: </span>
                      {q.answeringStrategy}
                    </div>

                    {/* Interactive Practice Workspace */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Practice Your Response
                      </label>
                      <textarea
                        rows={3}
                        value={practiceNotes[`proj_${idx}`] || ''}
                        onChange={(e) => updatePracticeNote(`proj_${idx}`, e.target.value)}
                        placeholder="Type your talking points or STAR response here..."
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Reveal Answer Button */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => toggleAnswer(`proj_${idx}`)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        {isRevealed ? 'Hide Model Answer' : 'Show Ideal Model Answer'}
                      </button>
                    </div>

                    {isRevealed && (
                      <div className="p-4 rounded-xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 text-xs text-slate-800 dark:text-slate-200 leading-relaxed animate-fadeIn">
                        <div className="font-bold text-purple-900 dark:text-purple-300 mb-1">
                          ✨ Model High-Scoring Response:
                        </div>
                        <p>{q.modelAnswer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 2. TECHNICAL QUESTIONS */}
          {activeCategory === 'technical' && (
            <div className="space-y-4">
              {(interviewData.technicalQuestions || []).map((q, idx) => {
                const isRevealed = revealedAnswers[`tech_${idx}`];
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg">
                        Topic: {q.topic}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        Difficulty: {q.difficulty || 'Medium'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      "{q.question}"
                    </h3>

                    {/* Key Concepts */}
                    {q.keyConcepts?.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="font-semibold text-slate-500">Key Concepts:</span>
                        {q.keyConcepts.map((kc, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                          >
                            {kc}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* What is evaluated */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Evaluates: </span>
                      <span className="text-slate-600 dark:text-slate-400">{q.evaluating}</span>
                    </div>

                    {/* Practice space */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Your Technical Explanation
                      </label>
                      <textarea
                        rows={3}
                        value={practiceNotes[`tech_${idx}`] || ''}
                        onChange={(e) => updatePracticeNote(`tech_${idx}`, e.target.value)}
                        placeholder="Draft your explanation in your own words..."
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => toggleAnswer(`tech_${idx}`)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {isRevealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        {isRevealed ? 'Hide Comprehensive Answer' : 'Show Comprehensive Technical Answer'}
                      </button>
                    </div>

                    {isRevealed && (
                      <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs text-slate-800 dark:text-slate-200 leading-relaxed animate-fadeIn">
                        <div className="font-bold text-blue-900 dark:text-blue-300 mb-1">
                          ✨ Benchmark Technical Answer:
                        </div>
                        <p>{q.idealAnswer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. HR & BEHAVIORAL QUESTIONS */}
          {activeCategory === 'hr' && (
            <div className="space-y-4">
              {(interviewData.hrQuestions || []).map((q, idx) => {
                const isRevealed = revealedAnswers[`hr_${idx}`];
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/60 px-2.5 py-1 rounded-lg">
                        Category: {q.category}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        Behavioral Interview
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      "{q.question}"
                    </h3>

                    {/* STAR Framework Breakdown */}
                    {q.starFramework && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-0.5">S – Situation</span>
                          <span className="text-slate-600 dark:text-slate-400 text-[11px]">{q.starFramework.situation}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                          <span className="font-bold text-blue-600 dark:text-blue-400 block mb-0.5">T – Task</span>
                          <span className="text-slate-600 dark:text-slate-400 text-[11px]">{q.starFramework.task}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                          <span className="font-bold text-purple-600 dark:text-purple-400 block mb-0.5">A – Action</span>
                          <span className="text-slate-600 dark:text-slate-400 text-[11px]">{q.starFramework.action}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">R – Result</span>
                          <span className="text-slate-600 dark:text-slate-400 text-[11px]">{q.starFramework.result}</span>
                        </div>
                      </div>
                    )}

                    {q.tips && (
                      <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300">
                        <span className="font-bold">💡 Recruiter Pro-Tip: </span>
                        {q.tips}
                      </div>
                    )}

                    {/* Practice Box */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        Draft Your Personal Story
                      </label>
                      <textarea
                        rows={3}
                        value={practiceNotes[`hr_${idx}`] || ''}
                        onChange={(e) => updatePracticeNote(`hr_${idx}`, e.target.value)}
                        placeholder="Recall a specific college or internship scenario..."
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
