# CareerCraft AI - Resume Builder & Career Assistant

A complete, production-ready AI-powered Resume Builder and Career Assistant web application engineered for university students and fresh graduates to craft professional, ATS-friendly resumes and prepare for technical and HR job interviews.

---

## 🌟 Key Features

### 1. User Authentication & Demo Fast-Track
- Secure JWT-based authentication with encrypted password hashing (`bcryptjs`).
- Instant **"One-Click Demo Student Access"** pre-loaded with realistic fresh graduate resume data for zero-friction evaluation.
- Profile management with custom roles and career targets.

### 2. Full-Featured ATS Resume Builder
- **Editable Sections**:
  - Personal Information (Full Name, Professional Title, Email, Phone, Location, LinkedIn, GitHub, Portfolio).
  - Professional Summary with **AI Summary Generator**.
  - Education (Institution, Degree, Field of Study, Dates, GPA, Honors, Coursework).
  - Categorized Skills (Programming Languages, Frameworks, Developer Tools, Soft Skills with tag management).
  - Featured Projects (Repo Links, Live Demo, Date, Tech Stack, Bullets with **AI Bullet Enhancers**).
  - Internships & Work Experience (Company, Role, Dates, Location, Responsibilities).
  - Certifications & Honors.
- **3 ATS-Optimized Templates**:
  - **Modern Tech**: Clean slate headers, subtle dividers, modern typography.
  - **Classic Ivy**: Traditional serif format, high corporate appeal.
  - **Minimalist**: High whitespace, single-column machine-parsable layout.
- **Split View / Live Preview**: Real-time side-by-side editing and preview.

### 3. AI-Powered Writing & Bullet Optimization
- **AI Professional Summary Generator**: Crafts 3 distinct variations (Impact & Metric-Driven, Technical Depth, Fresher / Fast Learner).
- **AI Bullet Point Polish (Google XYZ / STAR Method)**: Rewrites weak bullets into quantifiable accomplishments ("Accomplished [X] as measured by [Y] by doing [Z]").
- **AI Grammar & Executive Writing Audit**: Highlights passive voice, conversational filler words, and delivers improved clarity with before/after diffs.

### 4. PDF Resume Upload & Parser
- Drag-and-drop or file upload for existing `.pdf` resumes.
- Automatically extracts candidate details, education, skills, and projects, populating the interactive builder in seconds.

### 5. ATS Compatibility Score Engine
- Comprehensive machine-audit score (0–100) with letter grades (A+, A, B, C).
- **Factor-by-Factor Breakdown**:
  - Contact & Online Presence (15 pts)
  - Section Structure & Layout (15 pts)
  - Action Verbs & Voice Strength (20 pts)
  - Quantified Results & Metrics (25 pts)
  - Skills & Keyword Parsability (15 pts)
  - ATS Typography & Length Balance (10 pts)
- Actionable tips to maximize applicant tracking pass rates.

### 6. Job Description Matcher & Keyword Gap Analysis
- Paste any target job description (JD) from LinkedIn, Indeed, or career portals.
- Real-time match percentage calculation.
- Categorized keyword tags:
  - **Matched Skills** (Green badges)
  - **Missing Critical Skills** (Red / Amber badges)
- Tailored section-by-section advice to customize the resume for that specific job.

### 7. Personalized Portfolio Projects & Upskilling
- Recommends 3-4 concrete projects to learn missing skills in 1–2 weeks.
- Includes recommended tech stack, key features, and bullet points to add to the resume after building each project.

### 8. Resume-Grounded Interview Preparation Studio
- **Project Deep Dives**: Questions formulated specifically from the candidate's actual projects listed on the resume.
- **Technical Questions**: Core computer science and framework questions with difficulty rankings and benchmark model answers.
- **HR & Behavioral Questions**: Real situational interview questions with detailed STAR (Situation, Task, Action, Result) answers and recruiter pro-tips.
- **Interactive Practice Mode**: Type your responses and toggle reveal for ideal model answers.

### 9. High-Fidelity PDF Export & Application Tracker
- Pixel-perfect print-ready PDF export via `window.print()` and CSS print media stylesheets.
- Full Job Application Tracker with status tags (Applied, Interviewing, Offered, Rejected), salary targets, and notes.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm

### 1. Backend Server Setup
```bash
cd server
npm install
npm start
```
The server runs on `http://localhost:5000`.

To activate live **Gemini 3.8 Flash** generation, add your API key in `server/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(If left blank, the application automatically uses its realistic intelligent fallback engine, guaranteeing 100% functionality out-of-the-box!)*

### 2. Frontend Client Setup
```bash
cd client
npm install
npm run dev
```
The client runs on `http://localhost:5173`.

---

## 📁 Project Architecture

```
resume-career-ai/
├── server/
│   ├── src/
│   │   ├── db.js                 # Persistent JSON database with seed data & CRUD
│   │   ├── aiService.js          # Gemini 3.8 Flash API & intelligent fallback engine
│   │   ├── pdfService.js         # PDF text extraction and parsing
│   │   ├── middleware/auth.js    # JWT verification & security
│   │   ├── routes/
│   │   │   ├── auth.js           # Register, login, demo-login, profile
│   │   │   ├── resumes.js        # Resume CRUD & PDF upload
│   │   │   ├── ai.js             # Summary, bullet polish, ATS, JD match, interview prep
│   │   │   └── applications.js   # Job application pipeline tracker
│   │   └── index.js              # Express server entry point
│   ├── package.json
│   └── .env
└── client/
    ├── src/
    │   ├── api.js                # Centralized API client
    │   ├── context/
    │   │   ├── AuthContext.jsx   # Authentication state management
    │   │   └── ThemeContext.jsx  # Dark/Light mode theme state
    │   ├── components/
    │   │   ├── Navbar.jsx        # Navigation bar & theme switcher
    │   │   ├── Dashboard.jsx     # Executive career overview & stats
    │   │   ├── ResumeBuilder.jsx # Full-featured resume editor
    │   │   ├── ResumePreview.jsx # ATS-compliant templates (Modern, Classic, Minimalist)
    │   │   ├── JobMatcher.jsx    # JD comparison & keyword gap analysis
    │   │   ├── InterviewPrep.jsx # Tailored technical & HR interview studio
    │   │   ├── ApplicationsTracker.jsx # Job application pipeline
    │   │   ├── AtsScoreModal.jsx # Factor-by-factor ATS audit modal
    │   │   ├── AiSummaryModal.jsx # AI summary generation modal
    │   │   ├── AiBulletModal.jsx # AI XYZ/STAR bullet enhancer
    │   │   ├── AiGrammarModal.jsx # AI grammar & writing audit
    │   │   ├── PdfUploadModal.jsx # Drag-and-drop resume PDF importer
    │   │   └── AuthModal.jsx     # Sign in & registration modal
    │   ├── App.jsx               # Root application layout
    │   └── index.css             # Tailwind base styles & print stylesheet
    ├── index.html
    └── package.json
```
