import React, { useState, useRef, useEffect } from 'react';
import { api } from '../api';
import {
  MessageSquare,
  Bot,
  User,
  Send,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  Trash2,
  Loader2,
  Check,
  Copy,
  ChevronDown,
  ExternalLink,
  Zap,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function renderInlineFormatting(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={idx} className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 font-mono text-[11px] text-pink-600 dark:text-pink-400">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function MarkdownContent({ content }) {
  if (!content) return null;
  const blocks = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-xs leading-relaxed">
      {blocks.map((block, bIdx) => {
        if (block.startsWith('```') && block.endsWith('```')) {
          const lines = block.slice(3, -3).trim().split('\n');
          const firstLine = lines[0].trim();
          const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
          const lang = hasLang ? firstLine : '';
          const codeLines = hasLang ? lines.slice(1).join('\n') : lines.join('\n');
          return (
            <div key={bIdx} className="my-2 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 text-slate-100 font-mono text-[11px]">
              {lang && (
                <div className="px-3 py-1 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 font-sans flex justify-between">
                  <span>{lang}</span>
                </div>
              )}
              <pre className="p-3 overflow-x-auto selection:bg-blue-600">
                <code>{codeLines}</code>
              </pre>
            </div>
          );
        }

        const lines = block.split('\n');
        return (
          <div key={bIdx} className="space-y-1.5">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lIdx} className="h-1" />;

              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={lIdx} className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-2 mb-1">
                    {renderInlineFormatting(trimmed.replace(/^###\s+/, ''))}
                  </h4>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h3 key={lIdx} className="font-extrabold text-slate-900 dark:text-slate-100 text-sm mt-2.5 mb-1">
                    {renderInlineFormatting(trimmed.replace(/^##\s+/, ''))}
                  </h3>
                );
              }
              if (trimmed.startsWith('> ')) {
                return (
                  <blockquote key={lIdx} className="border-l-2 border-indigo-500 pl-2.5 py-0.5 text-slate-600 dark:text-slate-300 italic text-[11px] my-1 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-r">
                    {renderInlineFormatting(trimmed.replace(/^>\s+/, ''))}
                  </blockquote>
                );
              }
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <div key={lIdx} className="flex items-start gap-1.5 ml-1">
                    <span className="text-indigo-500 font-bold leading-5">•</span>
                    <span className="flex-1">{renderInlineFormatting(trimmed.slice(2))}</span>
                  </div>
                );
              }
              if (/^\d+\.\s/.test(trimmed)) {
                const match = trimmed.match(/^(\d+)\.\s+(.*)$/);
                return (
                  <div key={lIdx} className="flex items-start gap-1.5 ml-1">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 min-w-[14px]">{match[1]}.</span>
                    <span className="flex-1">{renderInlineFormatting(match[2])}</span>
                  </div>
                );
              }
              if (trimmed === '---') {
                return <hr key={lIdx} className="my-2 border-slate-200 dark:border-slate-800" />;
              }

              return <p key={lIdx}>{renderInlineFormatting(line)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function AiChatbot({ resume }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi there! I'm your **CareerCraft AI Assistant** powered by **Google Gemini**. 🤖\n\nI have access to your active resume profile (**${resume?.targetRole || 'Software Engineer'}**). How can I assist your job search today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (textToSend = input) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const userMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const data = await api.chatAssistant(
        newHistory.map(m => ({ role: m.role, content: m.content })),
        resume,
        resume?.targetRole || 'Software Engineer'
      );

      const botMessage = {
        id: 'bot_' + Date.now(),
        role: 'assistant',
        content: data.reply || 'I ran into an issue formulating an answer. Please try again!',
        source: data.source,
        model: data.model,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('[Chatbot Error]', err);
      setMessages(prev => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          role: 'assistant',
          content: 'Sorry, I encountered an issue connecting to the Gemini assistant. Please check your network or try again shortly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome_' + Date.now(),
        role: 'assistant',
        content: `Chat history cleared. How can I help you prepare for **${resume?.targetRole || 'Software Engineering'}** roles?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const quickPrompts = [
    { label: '🎯 ATS Pass Strategy', text: 'How do I optimize my resume to pass ATS filters at top tech companies?' },
    { label: '✨ STAR Bullet Polish', text: 'How can I rewrite my resume bullets using the Google XYZ / STAR formula?' },
    { label: '💡 Portfolio Ideas', text: 'Suggest 3 impressive portfolio projects for entry-level Software Engineers.' },
    { label: '🎙️ Mock Interview Qs', text: 'Give me 2 hard technical interview questions and 1 behavioral question based on my resume.' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print flex flex-col items-end">
      
      {/* Expanded Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 320 }}
            className="w-[92vw] sm:w-[420px] h-[580px] max-h-[82vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden mb-3"
          >
            {/* Window Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white flex items-center justify-between shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner">
                    <Bot className="h-5 w-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900" />
                </div>
                <div>
                  <h3 className="text-sm font-bold flex items-center gap-1.5 leading-tight">
                    CareerCraft AI
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-white/20 backdrop-blur-md">
                      Gemini
                    </span>
                  </h3>
                  <p className="text-[11px] text-blue-100 flex items-center gap-1">
                    <Zap className="h-3 w-3 text-yellow-300" />
                    <span>Active Career & Resume Coach</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  title="Clear conversation"
                  className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close assistant"
                  className="p-1.5 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Context Badge */}
            {resume && (
              <div className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between shrink-0">
                <span className="truncate max-w-[280px]">
                  📌 Grounded in: <strong className="text-slate-800 dark:text-slate-200">{resume.personalInfo?.fullName || 'Candidate'}</strong> ({resume.targetRole || 'Software Engineer'})
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                  ATS Ready
                </span>
              </div>
            )}

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Avatar */}
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-xs ${
                      isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-gradient-to-tr from-indigo-500 to-purple-600 text-white'
                    }`}>
                      {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                    </div>

                    {/* Bubble */}
                    <div className={`relative max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-2xs leading-relaxed group ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs border border-slate-200/70 dark:border-slate-700/70'
                    }`}>
                      {/* Copy action on assistant message */}
                      {!isUser && (
                        <button
                          onClick={() => handleCopy(m.id, m.content)}
                          title="Copy response"
                          className="absolute right-2 top-2 p-1 rounded bg-white/70 dark:bg-slate-700/70 text-slate-500 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copiedId === m.id ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        </button>
                      )}

                      {/* Content rendering with structured markdown parsing */}
                      {isUser ? (
                        <div className="whitespace-pre-wrap font-sans text-xs">
                          {m.content}
                        </div>
                      ) : (
                        <MarkdownContent content={m.content} />
                      )}

                      <div className={`text-[9px] mt-1 text-right ${isUser ? 'text-blue-200' : 'text-slate-400'}`}>
                        {m.timestamp}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Loading Indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs w-max"
                >
                  <Bot className="h-4 w-4 text-indigo-500 animate-spin" />
                  <span>Gemini 3.8 Flash is thinking...</span>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips (Always available on scroll top/idle) */}
            <div className="px-3 py-2 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                {quickPrompts.map((qp, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(qp.text)}
                    disabled={loading}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-slate-700 dark:text-slate-300 transition-colors shadow-2xs font-medium"
                  >
                    {qp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Gemini about ATS, bullets, interview prep..."
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white shadow-md transition-all shrink-0"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <motion.button
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle CareerBot AI Assistant"
        className="relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-semibold text-xs shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all border border-white/20 group"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
          <Bot className="h-4 w-4 group-hover:rotate-12 transition-transform" />
        </div>
        <span className="hidden sm:inline">AI Career Assistant</span>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
        </span>
      </motion.button>

    </div>
  );
}
