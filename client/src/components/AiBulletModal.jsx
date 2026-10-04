import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Sparkles, Check, Loader2, X, ArrowRight, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AiBulletModal({ isOpen, onClose, initialText, role, techStack, onApplyBullet }) {
  const [text, setText] = useState(initialText || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (initialText) {
      setText(initialText);
      handleImprove(initialText);
    }
  }, [initialText]);

  if (!isOpen) return null;

  const handleImprove = async (inputText = text) => {
    if (!inputText || inputText.trim() === '') return;
    setLoading(true);
    try {
      const data = await api.improveBullet({
        text: inputText,
        role: role || 'Software Engineer',
        techStack: techStack || ''
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Bullet Point Enhancer (STAR / XYZ Method)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transform passive descriptions into punchy, metric-backed accomplishments recruiters notice.
            </p>
          </div>
        </div>

        {/* Original Bullet Input */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Current Bullet Point
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Worked on the website and fixed bugs"
              className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={() => handleImprove()}
              disabled={loading || !text.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50 transition-all shrink-0"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Enhance
            </button>
          </div>
        </div>

        {/* AI Critique */}
        {result?.critique && (
          <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-300 mb-5 flex items-start gap-2.5">
            <Target className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-semibold">AI Recruiter Critique: </span>
              {result.critique}
            </p>
          </div>
        )}

        {/* Suggestions */}
        {result?.suggestions && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Choose an Improved Variation
            </h3>

            {result.suggestions.map((s, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
              >
                <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed mb-3">
                  {s.text}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Formula:</span>
                    <span className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      {s.formula}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onApplyBullet(s.text);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Apply to Resume
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
