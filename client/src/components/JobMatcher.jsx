import React, { useState } from 'react';
import { api } from '../api';
import {
  Target,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Loader2,
  Check,
  Building,
  Briefcase,
  Layers,
  Code
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export default function JobMatcher({ currentResume, onNavigateToBuilder }) {
  const [jobTitle, setJobTitle] = useState('Junior Software Engineer');
  const [company, setCompany] = useState('Google');
  const [jobDescription, setJobDescription] = useState(
    `We are looking for a Junior Software Engineer with experience in TypeScript, React, Node.js, and relational databases (PostgreSQL). Knowledge of Docker containerization, RESTful APIs, distributed systems, and CI/CD pipelines is highly desirable. Candidates should demonstrate clean coding practices, version control with Git, and strong analytical problem-solving skills.`
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCompare = async () => {
    if (!jobDescription.trim() || !currentResume) return;
    setLoading(true);
    try {
      const data = await api.matchJob(currentResume, jobDescription, jobTitle, company, true);
      setResult(data);
      if (data.matchScore >= 80) {
        try {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        } catch (e) {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (val) => {
    if (val >= 85) return 'text-emerald-500 stroke-emerald-500';
    if (val >= 70) return 'text-blue-500 stroke-blue-500';
    return 'text-amber-500 stroke-amber-500';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md mb-2">
            <Target className="h-3.5 w-3.5" />
            <span>AI Job Description & Keyword Scanner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Targeted ATS Job Matcher & Gap Analysis
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mt-1">
            Paste any internship or full-time job description to calculate your ATS match percentage, uncover missing critical keywords, and receive tailored portfolio project suggestions to bridge the gap.
          </p>
        </div>
      </div>

      {/* Main Grid: Input Form & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: JOB INPUT */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Target Opportunity Details
            </h3>
            <span className="text-[11px] text-slate-500">Step 1 of 2</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Job Title
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Junior Full Stack Engineer"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Company Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google / Stripe / Startup"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Paste Job Description (JD)
              </label>
              <textarea
                rows={9}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the requirements, qualifications, and responsibilities from LinkedIn, Indeed, or company careers page..."
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-white leading-relaxed focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleCompare}
              disabled={loading || !jobDescription.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md disabled:opacity-50 transition-all mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing Keywords & Scoring ATS Fit...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Compare Resume Against Job
                </>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: COMPARISON RESULTS */}
        <div className="lg:col-span-7 space-y-5">
          {!result && !loading && (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 mb-4">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ready for Real-Time ATS Gap Analysis
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                Enter your target role and paste the job description on the left to extract matching skills, identify missing keywords, and get upskilling suggestions.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center p-16 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Scanning Resume against Job Description...
              </div>
              <p className="text-xs text-slate-500">
                Evaluating keyword overlap, hard skill density, and generating portfolio projects to bridge gaps.
              </p>
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              {/* Match Score Hero Card */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                  <div className="flex items-center gap-5">
                    {/* Radial Score Gauge */}
                    <div className="relative flex h-20 w-20 items-center justify-center shrink-0">
                      <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                        <path
                          className="text-slate-200 dark:text-slate-800 stroke-current"
                          strokeWidth="3.5"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: result.matchScore / 100 }}
                          transition={{ duration: 1.2, ease: "easeOut" }}
                          className={`${getScoreColor(result.matchScore)}`}
                          strokeDasharray="100, 100"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-xl font-black text-slate-900 dark:text-white leading-none">
                          {result.matchScore}%
                        </span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase">Match</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {result.matchScore >= 80 ? 'High ATS Match - Ready to Apply' : 'Moderate Match - Keyword Optimization Recommended'}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {result.roleFitSummary}
                      </p>
                    </div>
                  </div>

                  {onNavigateToBuilder && (
                    <button
                      onClick={onNavigateToBuilder}
                      className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Optimize in Builder
                    </button>
                  )}
                </div>
              </div>

              {/* Matched vs Missing Keywords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Matched Keywords */}
                <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                      Matched Skills & Keywords ({result.matchedKeywords?.length || 0})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(result.matchedKeywords || []).map((kw, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
                      >
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 dark:bg-rose-950/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    <span className="text-xs font-bold text-rose-900 dark:text-rose-300">
                      Missing Critical Keywords ({[...(result.missingKeywords?.critical || []), ...(result.missingKeywords?.niceToHave || [])].length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(result.missingKeywords?.critical || []).map((kw, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200"
                      >
                        ! {kw} <span className="text-[10px] opacity-75">(Critical)</span>
                      </span>
                    ))}
                    {(result.missingKeywords?.niceToHave || []).map((kw, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Tailoring Recommendations */}
              {result.tailoringTips?.length > 0 && (
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    Step-by-Step Resume Tailoring Advice
                  </h4>
                  <div className="space-y-2 pt-1 text-xs">
                    {result.tailoringTips.map((tip, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/70">
                        <span className="font-bold text-blue-600 dark:text-blue-400">{tip.section}: </span>
                        <span className="text-slate-700 dark:text-slate-300">{tip.tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Projects to Bridge the Skills Gap */}
              {result.upskillingPlan?.suggestedProjects?.length > 0 && (
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Code className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        Recommended Portfolio Projects to Learn Missing Skills
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Build one of these hands-on projects in 1-2 weeks to demonstrate production proficiency.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {result.upskillingPlan.suggestedProjects.map((proj, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-purple-300 dark:hover:border-purple-700 transition-all text-xs space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {proj.title}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                            {proj.difficulty}
                          </span>
                        </div>

                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {proj.description}
                        </p>

                        <div className="pt-1">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Tech Stack: </span>
                          <span className="text-purple-600 dark:text-purple-400 font-medium">{proj.techStack}</span>
                        </div>

                        {proj.resumeBulletExample && (
                          <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                            <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px] mb-0.5">
                              Add to Resume after building:
                            </span>
                            <span className="text-slate-800 dark:text-slate-200 italic">
                              "{proj.resumeBulletExample}"
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
}
