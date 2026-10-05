const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getHeaders() {
  const token = localStorage.getItem('careercraft_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async register(name, email, password, role) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  },

  async demoLogin() {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Demo login failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch user');
    return data;
  },

  // Resumes
  async getResumes() {
    const res = await fetch(`${API_BASE}/resumes`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch resumes');
    return data.resumes;
  },

  async getResume(id) {
    const res = await fetch(`${API_BASE}/resumes/${id}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch resume');
    return data.resume;
  },

  async createResume(resumeData) {
    const res = await fetch(`${API_BASE}/resumes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(resumeData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create resume');
    return data.resume;
  },

  async updateResume(id, resumeData) {
    const res = await fetch(`${API_BASE}/resumes/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(resumeData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update resume');
    return data;
  },

  async deleteResume(id) {
    const res = await fetch(`${API_BASE}/resumes/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete resume');
    return data;
  },

  async uploadResumePdf(file) {
    const token = localStorage.getItem('careercraft_token');
    const formData = new FormData();
    formData.append('resumePdf', file);

    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/resumes/upload-pdf`, {
      method: 'POST',
      headers,
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to upload and parse PDF');
    return data;
  },

  // AI Services
  async getAiStatus() {
    const res = await fetch(`${API_BASE}/ai/status`);
    return await res.json();
  },

  async generateSummary(params) {
    const res = await fetch(`${API_BASE}/ai/summary`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate summary');
    return data;
  },

  async improveBullet(params) {
    const res = await fetch(`${API_BASE}/ai/improve-bullet`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(params)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to improve bullet');
    return data;
  },

  async checkGrammar(text) {
    const res = await fetch(`${API_BASE}/ai/grammar`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to check grammar');
    return data;
  },

  async analyzeResume(resume) {
    const res = await fetch(`${API_BASE}/ai/analyze-resume`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ resume })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to analyze resume');
    return data;
  },

  async getAtsScore(resume, targetRole) {
    const res = await fetch(`${API_BASE}/ai/ats-score`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ resume, targetRole })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to calculate ATS score');
    return data;
  },

  async matchJob(resume, jobDescription, jobTitle, company, saveToHistory = true) {
    const res = await fetch(`${API_BASE}/ai/match-job`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ resume, jobDescription, jobTitle, company, saveToHistory })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to match job description');
    return data;
  },

  async suggestProjects(missingSkills, targetRole, currentSkills) {
    const res = await fetch(`${API_BASE}/ai/suggest-projects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ missingSkills, targetRole, currentSkills })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to get project suggestions');
    return data;
  },

  async getInterviewPrep(resume, targetRole) {
    const res = await fetch(`${API_BASE}/ai/interview-prep`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ resume, targetRole })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to generate interview prep');
    return data;
  },

  async chatAssistant(messages, resume, targetRole) {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ messages, resume, targetRole })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send chat message');
    return data;
  },

  // Applications
  async getApplications() {
    const res = await fetch(`${API_BASE}/applications`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch applications');
    return data.applications;
  },

  async createApplication(appData) {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(appData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create application');
    return data.application;
  },

  async updateApplication(id, appData) {
    const res = await fetch(`${API_BASE}/applications/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(appData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update application');
    return data.application;
  },

  async deleteApplication(id) {
    const res = await fetch(`${API_BASE}/applications/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete application');
    return data;
  }
};
