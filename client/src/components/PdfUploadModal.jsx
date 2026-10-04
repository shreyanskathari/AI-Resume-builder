import React, { useState, useRef } from 'react';
import { api } from '../api';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

export default function PdfUploadModal({ isOpen, onClose, onResumeImported }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progressStep, setProgressStep] = useState('');
  const inputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.name.toLowerCase().endsWith('.pdf')) {
        setFile(droppedFile);
        setError('');
      } else {
        setError('Please drop a valid PDF file.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type === 'application/pdf' || selected.name.toLowerCase().endsWith('.pdf')) {
        setFile(selected);
        setError('');
      } else {
        setError('Please select a valid PDF file.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setProgressStep('Extracting text and metadata from PDF...');

    try {
      setTimeout(() => setProgressStep('Structuring sections with AI parser...'), 1200);
      const res = await api.uploadResumePdf(file);
      setProgressStep('Complete!');
      
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}

      if (onResumeImported) {
        onResumeImported(res.resume);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to parse PDF resume.');
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
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 mb-3 shadow-inner">
            <UploadCloud className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Upload Existing Resume
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Our AI parser extracts your contact info, education, skills, projects, and experiences automatically.
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-xs font-medium dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-900">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !loading && inputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragActive
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
              : file
              ? 'border-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20'
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-800/30'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {file ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <FileText className="h-6 w-6" />
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {file.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {(file.size / 1024).toFixed(1)} KB • Ready to parse
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <UploadCloud className="h-10 w-10 text-slate-400 mb-1" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Click to browse or drag and drop your PDF resume
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Maximum file size: 10MB (Standard PDF)
              </p>
            </div>
          )}
        </div>

        {loading && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{progressStep}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || loading}
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Parsing Resume...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Import & Extract Resume
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
