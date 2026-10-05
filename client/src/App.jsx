import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { api } from './api';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ResumeBuilder from './components/ResumeBuilder';
import JobMatcher from './components/JobMatcher';
import InterviewPrep from './components/InterviewPrep';
import ApplicationsTracker from './components/ApplicationsTracker';
import AuthModal from './components/AuthModal';
import PdfUploadModal from './components/PdfUploadModal';
import AtsScoreModal from './components/AtsScoreModal';
import AiChatbot from './components/AiChatbot';
import { Loader2, Heart, Sparkles, FileText, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function MainContent() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentResume, setCurrentResume] = useState(null);
  const [loadingResume, setLoadingResume] = useState(true);

  // Global modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [atsAnalysis, setAtsAnalysis] = useState(null);

  useEffect(() => {
    loadUserResume();
  }, [user]);

  const loadUserResume = async () => {
    setLoadingResume(true);
    try {
      const resumes = await api.getResumes();
      if (resumes && resumes.length > 0) {
        setCurrentResume(resumes[0]);
        // Also get initial ATS audit safely
        try {
          const atsData = await api.getAtsScore(resumes[0], resumes[0].targetRole);
          setAtsAnalysis(atsData);
        } catch (atsErr) {
          console.warn('ATS initial audit skipped:', atsErr.message);
        }
      }
    } catch (err) {
      console.warn('Could not load resumes:', err.message);
    } finally {
      setLoadingResume(false);
    }
  };

  const handleOpenAtsAudit = async () => {
    if (!currentResume) return;
    try {
      const atsData = await api.getAtsScore(currentResume, currentResume.targetRole);
      setAtsAnalysis(atsData);
      setIsAtsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-xl shadow-blue-500/30">
            <FileText className="h-7 w-7" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Initializing CareerCraft AI...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main App Body with AnimatePresence */}
      <main className="flex-1 pb-16 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.24, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full"
          >
            {activeTab === 'dashboard' && (
              <Dashboard
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenPdfModal={() => setIsPdfModalOpen(true)}
                onOpenAtsModal={handleOpenAtsAudit}
                resume={currentResume}
                setResume={setCurrentResume}
              />
            )}

            {activeTab === 'builder' && (
              <ResumeBuilder
                initialResume={currentResume}
                onResumeUpdated={(updated) => setCurrentResume(updated)}
              />
            )}

            {activeTab === 'matcher' && (
              <JobMatcher
                currentResume={currentResume}
                onNavigateToBuilder={() => setActiveTab('builder')}
              />
            )}

            {activeTab === 'interview' && (
              <InterviewPrep
                currentResume={currentResume}
              />
            )}

            {activeTab === 'applications' && (
              <ApplicationsTracker />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">CareerCraft AI</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-slate-500 dark:text-slate-400">Engineered for Students & Fresh Graduates</span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
              <span className="hover:text-blue-500 transition-colors cursor-pointer" onClick={() => setActiveTab('matcher')}>ATS Compatibility Engine</span>
              <span className="hover:text-blue-500 transition-colors cursor-pointer" onClick={() => setActiveTab('builder')}>STAR Bullet Optimizer</span>
              <span className="hover:text-blue-500 transition-colors cursor-pointer" onClick={() => setActiveTab('interview')}>Interview Studio</span>
            </div>
          </div>
          
          <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 text-center sm:text-left">
            <p className="tracking-normal font-normal">
              © 2026 Shreyans Kathari. All Rights Reserved.
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Empowering next-generation engineers with ATS-ready resumes and intelligent interview coaching.
            </p>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <PdfUploadModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        onResumeImported={(imported) => {
          setCurrentResume(imported);
          setActiveTab('builder');
        }}
      />

      {atsAnalysis && (
        <AtsScoreModal
          isOpen={isAtsModalOpen}
          onClose={() => setIsAtsModalOpen(false)}
          atsData={atsAnalysis}
          onNavigateToBuilder={() => setActiveTab('builder')}
        />
      )}

      {/* Floating AI Career Chatbot */}
      <AiChatbot resume={currentResume} />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
