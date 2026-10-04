import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../api';
import {
  FileText,
  Briefcase,
  Target,
  Sparkles,
  Sun,
  Moon,
  LogOut,
  User,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth }) {
  const { user, logout, demoLogin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Briefcase },
    { id: 'builder', label: 'Resume Builder', icon: FileText },
    { id: 'matcher', label: 'Job & ATS Matcher', icon: Target },
    { id: 'interview', label: 'Interview Prep', icon: Sparkles },
    { id: 'applications', label: 'Applications', icon: Briefcase }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                CareerCraft <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">AI</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">ATS Resume & Career Studio</p>
            </div>
          </motion.button>
        </div>

        {/* Desktop Navigation with Animated Sliding Pill */}
        <nav className="hidden md:flex items-center gap-1 relative bg-slate-100/70 dark:bg-slate-800/50 p-1 rounded-xl">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors z-10 ${
                  isActive
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    className="absolute inset-0 bg-white dark:bg-slate-750 rounded-lg shadow-xs z-[-1]"
                  />
                )}
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <motion.button
            whileTap={{ scale: 0.9, rotate: 20 }}
            onClick={toggleTheme}
            aria-label="Toggle dark/light mode"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </motion.button>

          {/* User Profile or Login */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 pl-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-sm ring-2 ring-indigo-500/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                    {user.role || 'CS Graduate'}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                title="Log out"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:border-slate-700 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-950/30 transition-colors ml-1"
              >
                <LogOut className="h-4 w-4" />
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => demoLogin()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/80 transition-colors"
              >
                <Zap className="h-3.5 w-3.5 text-amber-500 animate-bounce" />
                Demo User
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                Sign In
              </motion.button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-300"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1"
          >
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
            {!user && (
              <button
                onClick={() => {
                  demoLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
              >
                <Zap className="h-4 w-4" />
                Sign in with Demo Account
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
