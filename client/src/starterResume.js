export function getStarterResume(user = null) {
  return {
    id: 'res_' + Math.random().toString(36).substring(2, 10),
    userId: user?.id || 'guest',
    title: `${user?.name || 'Primary'}'s Resume`,
    targetRole: user?.role || 'Software Engineer',
    templateId: 'modern',
    personalInfo: {
      fullName: user?.name || 'Student Candidate',
      title: user?.role || 'Software Engineer & CS Graduate',
      email: user?.email || '',
      phone: '+1 (555) 019-2834',
      location: 'San Francisco, CA',
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      portfolio: '',
      summary: `Motivated ${user?.role || 'software engineer'} with hands-on experience building modern web applications, scalable APIs, and clean user interfaces.`
    },
    education: [
      {
        id: 'edu-1',
        institution: 'University / Institute of Technology',
        degree: 'Bachelor of Science / Technology',
        fieldOfStudy: user?.role || 'Computer Science & Engineering',
        location: 'City, State',
        startDate: '2022-08',
        endDate: '2026-05',
        gpa: '3.8 / 4.0',
        honors: "Dean's Honor List",
        coursework: 'Data Structures, Algorithms, DBMS, Operating Systems, Web Technologies'
      }
    ],
    skills: {
      technical: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'Java', 'SQL', 'HTML/CSS'],
      frameworks: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'Tailwind CSS'],
      tools: ['Git & GitHub', 'Docker', 'Postman', 'VS Code', 'MongoDB', 'PostgreSQL'],
      soft: ['Agile / Scrum', 'Problem Solving', 'Technical Communication', 'Team Leadership'],
      languages: ['English (Fluent)']
    },
    projects: [
      {
        id: 'proj-1',
        title: 'CareerCraft AI - Intelligent Career Platform',
        techStack: 'React, Node.js, Express, Tailwind CSS, REST APIs',
        liveUrl: 'https://careercraft-ai-demo.onrender.com',
        githubUrl: 'https://github.com',
        startDate: '2025-08',
        endDate: '2025-12',
        bullets: [
          'Architected a full-stack career acceleration application featuring real-time ATS scoring and AI-driven resume optimization.',
          'Implemented interactive resume templates with instantaneous live preview, reducing resume crafting time by 60%.',
          'Engineered RESTful API endpoints with JWT authentication and secure session management.'
        ]
      }
    ],
    internships: [],
    experience: [],
    certifications: [],
    achievements: [
      {
        id: 'ach-1',
        title: 'University Hackathon Finalist',
        date: '2025-03',
        description: 'Designed and deployed a full-stack web application within a 36-hour sprint.'
      }
    ],
    atsScore: 88,
    resumeScore: 90
  };
}
