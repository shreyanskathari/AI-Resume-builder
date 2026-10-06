import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Sparkles, Check, Loader2, X, Copy, BookOpen, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AiSummaryModal({ isOpen, onClose, currentRole, skills, education, onSelectSummary }) {
  const [role, setRole] = useState(currentRole || 'Software Engineer');
  const [tone, setTone] = useState('impactful');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  useEffect(() => {
    if (currentRole) {
      setRole(currentRole);
    }
  }, [currentRole]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.generateSummary({
        targetRole: role || 'Software Engineer',
        skills: Array.isArray(skills) ? skills : Object.values(skills || {}).flat(),
        education: education?.[0]?.degree ? `${education[0].degree} from ${education[0].institution}` : '',
        tone
      });
      setResults(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate summary. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
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
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Professional Summary Generator
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Craft punchy, ATS-optimized 3-sentence executive summaries tailored to your target job.
            </p>
          </div>
        </div>

        {/* Form Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Target Job Title
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Junior Full Stack Engineer"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Emphasis & Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="impactful">Impact & Metric-Driven (Recommended)</option>
              <option value="technical">Technical Depth & Architecture</option>
              <option value="fresher">Fresh Graduate / Fast Learner</option>
            </select>
          </div>
        </div>

        <div className="mb-6 flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-md disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating with AI...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Tailored Summaries
              </>
            )}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200 border border-rose-200 dark:border-rose-900 text-xs">
            <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">{error}</p>
              <button
                type="button"
                onClick={handleGenerate}
                className="mt-2 inline-flex items-center gap-1 font-semibold underline text-rose-700 dark:text-rose-300 hover:opacity-80"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {results?.variations && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Select Your Preferred Variation
            </h3>

            {results.variations.map((v, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded">
                    {v.type}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(v.summary, idx)}
                      className="p-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedIdx === idx ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => {
                        onSelectSummary(v.summary);
                        onClose();
                      }}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                    >
                      Use This Summary
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-2 font-normal">
                  {v.summary}
                </p>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  💡 {v.highlight}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
