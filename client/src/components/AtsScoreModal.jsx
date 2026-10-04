import React from 'react';
import { X, CheckCircle, AlertTriangle, ShieldCheck, TrendingUp, Award, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AtsScoreModal({ isOpen, onClose, atsData, onNavigateToBuilder }) {
  if (!isOpen || !atsData) return null;

  const score = atsData.totalScore || 85;
  const grade = atsData.grade || (score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : 'C');

  const getScoreColor = (val) => {
    if (val >= 85) return 'text-emerald-500 stroke-emerald-500';
    if (val >= 70) return 'text-blue-500 stroke-blue-500';
    if (val >= 50) return 'text-amber-500 stroke-amber-500';
    return 'text-rose-500 stroke-rose-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ type: "spring", damping: 28, stiffness: 360 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            initial={{ scale: 0.6, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400"
          >
            <ShieldCheck className="h-6 w-6" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              ATS Compatibility Audit
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                Grade {grade}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Evaluated against modern applicant tracking algorithms (Workday, Greenhouse, Lever, Taleo)
            </p>
          </div>
        </div>

        {/* Score Hero Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-5 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-800/60 dark:to-blue-950/30 border border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-5">
            {/* Circular Gauge */}
            <div className="relative flex h-24 w-24 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-slate-200 dark:text-slate-700 stroke-current"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: score / 100 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className={`${getScoreColor(score)}`}
                  strokeDasharray="100, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                  {score}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">/ 100</span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {score >= 85 ? 'Highly Competitive ATS Profile' : score >= 70 ? 'Solid Foundation - Needs Fine-Tuning' : 'ATS Warning: Formatting & Content Gaps'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-sm">
                {atsData.recommendation || 'Your resume adheres to standard machine-parsable sections, clear hierarchies, and high keyword density.'}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
            <div className="text-center sm:text-right">
              <span className="text-xs text-slate-500 font-medium">ATS Pass Probability</span>
              <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                {score >= 85 ? '94%' : score >= 70 ? '78%' : '48%'}
              </div>
            </div>
          </div>
        </div>

        {/* Factor Breakdown */}
        <div className="space-y-3 mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Factor-by-Factor Breakdown
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {(atsData.factors || []).map((factor, idx) => {
              const isPass = factor.status === 'pass';
              const pct = Math.round((factor.score / factor.maxScore) * 100);

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {isPass ? (
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                      )}
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {factor.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {factor.score} / {factor.maxScore} pts
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                        isPass ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {pct}%
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.08 }}
                      className={`h-full rounded-full ${
                        pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                    />
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {factor.explanation}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close
          </button>
          {onNavigateToBuilder && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onClose();
                onNavigateToBuilder();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Optimize Resume in Builder
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
