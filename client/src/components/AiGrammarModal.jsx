import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { CheckCircle2, AlertCircle, Loader2, X, Sparkles, Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AiGrammarModal({ isOpen, onClose, initialText, onApplyText }) {
  const [text, setText] = useState(initialText || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (initialText) {
      setText(initialText);
      handleCheck(initialText);
    }
  }, [initialText]);

  if (!isOpen) return null;

  const handleCheck = async (inputText = text) => {
    if (!inputText || inputText.trim() === '') return;
    setLoading(true);
    try {
      const data = await api.checkGrammar(inputText);
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
          <motion.div
            initial={{ scale: 0.6, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400"
          >
            <CheckCircle2 className="h-6 w-6" />
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              AI Grammar & Executive Writing Polish
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Eliminate passive voice, grammatical inconsistencies, and informal phrasing.
            </p>
          </div>
        </div>

        {/* Input Text Area */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Text to Review
          </label>
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-white focus:border-emerald-500 focus:outline-none"
            placeholder="Paste your resume sentence or paragraph here..."
          />
          <div className="flex justify-end mt-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCheck()}
              disabled={loading || !text.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Analyze & Polish
            </motion.button>
          </div>
        </div>

        {/* Results */}
        {result?.improvedText && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  Polished Recommendation
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
                  Clarity: {result.clarityScore || 95}%
                </span>
              </div>

              <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed mb-3">
                {result.improvedText}
              </p>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    onApplyText(result.improvedText);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  <Check className="h-3.5 w-3.5" />
                  Apply Improved Text
                </motion.button>
              </div>
            </div>

            {/* List of changes */}
            {result.changes?.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Specific Corrections Made
                </h4>
                {result.changes.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs"
                  >
                    <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 mb-1">
                      <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px]">
                        {c.type}
                      </span>
                      <span className="line-through text-red-500">{c.before}</span>
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">{c.after}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      {c.reason}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
