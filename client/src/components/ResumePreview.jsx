import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink, Link as LinkIcon, Code } from 'lucide-react';

function LinkedInIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.65 1.65 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66 1.66 1.66 1.66 0 0 0 1.66-1.66c0-.92-.74-1.66-1.66-1.66Z"/>
    </svg>
  );
}

function GitHubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/>
    </svg>
  );
}

export default function ResumePreview({ resume, templateId = 'modern' }) {
  if (!resume) return null;

  const {
    personalInfo = {},
    education = [],
    skills = {},
    projects = [],
    internships = [],
    experience = [],
    certifications = [],
    achievements = []
  } = resume;

  // Render Modern Tech Template
  if (templateId === 'modern') {
    return (
      <div id="resume-document" className="resume-paper w-full bg-white text-slate-900 p-8 sm:p-10 font-sans shadow-lg rounded-xl border border-slate-200 print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
            {personalInfo.fullName || 'Your Full Name'}
          </h1>
          <p className="text-sm font-semibold text-blue-700 tracking-wide mt-0.5">
            {personalInfo.title || 'Aspiring Software Engineer'}
          </p>

          {/* Contact Details */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600 mt-2 font-medium">
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3 text-slate-400 no-print" />
                <a href={`mailto:${personalInfo.email}`} className="hover:underline text-slate-800">{personalInfo.email}</a>
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3 text-slate-400 no-print" />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 text-slate-400 no-print" />
                <span>{personalInfo.location}</span>
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <LinkedInIcon className="h-3 w-3 text-slate-400 no-print" />
                <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">LinkedIn</a>
              </span>
            )}
            {personalInfo.github && (
              <span className="flex items-center gap-1">
                <GitHubIcon className="h-3 w-3 text-slate-400 no-print" />
                <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">GitHub</a>
              </span>
            )}
            {personalInfo.portfolio && (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3 text-slate-400 no-print" />
                <a href={personalInfo.portfolio} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">Portfolio</a>
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-1.5">
              Professional Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{edu.institution}</span>
                    <span className="text-[11px] font-medium text-slate-600">{edu.startDate} – {edu.endDate || 'Present'}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-slate-800">
                    <span>{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''} {edu.gpa ? `• GPA: ${edu.gpa}` : ''}</span>
                    {edu.location && <span className="text-[11px] text-slate-500 italic">{edu.location}</span>}
                  </div>
                  {edu.honors && <p className="text-[11px] text-slate-600 mt-0.5"><span className="font-semibold">Honors:</span> {edu.honors}</p>}
                  {edu.coursework && <p className="text-[11px] text-slate-600 mt-0.5"><span className="font-semibold">Relevant Coursework:</span> {edu.coursework}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {skills && Object.keys(skills).length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              Technical & Core Competencies
            </h2>
            <div className="text-xs space-y-1">
              {skills.technical?.length > 0 && (
                <p><span className="font-bold text-slate-900">Programming Languages:</span> <span className="text-slate-700">{skills.technical.join(', ')}</span></p>
              )}
              {skills.frameworks?.length > 0 && (
                <p><span className="font-bold text-slate-900">Frameworks & Libraries:</span> <span className="text-slate-700">{skills.frameworks.join(', ')}</span></p>
              )}
              {skills.tools?.length > 0 && (
                <p><span className="font-bold text-slate-900">Developer Tools & Cloud:</span> <span className="text-slate-700">{skills.tools.join(', ')}</span></p>
              )}
              {skills.soft?.length > 0 && (
                <p><span className="font-bold text-slate-900">Methodologies & Soft Skills:</span> <span className="text-slate-700">{skills.soft.join(', ')}</span></p>
              )}
            </div>
          </div>
        )}

        {/* Internships & Experience */}
        {(internships.length > 0 || experience.length > 0) && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              Experience & Internships
            </h2>
            <div className="space-y-3">
              {[...internships, ...experience].map((item, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{item.role || item.position} <span className="font-semibold text-slate-700">| {item.company}</span></span>
                    <span className="text-[11px] font-medium text-slate-600">{item.startDate} – {item.endDate || 'Present'}</span>
                  </div>
                  {item.location && <p className="text-[11px] text-slate-500 italic mb-1">{item.location}</p>}
                  {item.bullets?.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700 mt-1">
                      {item.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-normal">{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Projects */}
        {projects.length > 0 && (
          <div className="mb-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              Featured Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <span>{proj.title}</span>
                      {proj.techStack && <span className="text-[11px] font-normal text-slate-600">({proj.techStack})</span>}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600">{proj.startDate} – {proj.endDate || 'Present'}</span>
                  </div>
                  {(proj.githubUrl || proj.liveUrl) && (
                    <div className="flex items-center gap-3 text-[11px] text-blue-700 mb-1">
                      {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="hover:underline">Repository Link</a>}
                      {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="hover:underline">Live Demo</a>}
                    </div>
                  )}
                  {proj.bullets?.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700 mt-1">
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-normal">{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications & Achievements */}
        {(certifications.length > 0 || achievements.length > 0) && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              Certifications & Honors
            </h2>
            <div className="text-xs space-y-1.5">
              {certifications.map((c, idx) => (
                <p key={idx} className="text-slate-700">
                  <span className="font-bold text-slate-900">{c.name}</span> – {c.issuer} {c.date ? `(${c.date})` : ''}
                </p>
              ))}
              {achievements.map((a, idx) => (
                <p key={idx} className="text-slate-700">
                  <span className="font-bold text-slate-900">{a.title}</span> {a.date ? `(${a.date})` : ''} – {a.description}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Classic Ivy League Template
  if (templateId === 'classic') {
    return (
      <div id="resume-document" className="resume-paper w-full bg-white text-black p-8 sm:p-10 font-serif shadow-lg rounded-xl border border-slate-200 print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="text-center border-b border-black pb-3 mb-4">
          <h1 className="text-2xl font-bold tracking-normal uppercase">
            {personalInfo.fullName || 'Candidate Name'}
          </h1>
          <p className="text-xs italic text-gray-700 mt-0.5">
            {personalInfo.title || 'Software Engineer'}
          </p>
          <div className="text-[11px] text-gray-800 mt-1 space-x-2">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
            {personalInfo.linkedin && <span>• <a href={personalInfo.linkedin} className="underline">LinkedIn</a></span>}
            {personalInfo.github && <span>• <a href={personalInfo.github} className="underline">GitHub</a></span>}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1">
              Summary
            </h2>
            <p className="text-xs leading-relaxed text-justify">{personalInfo.summary}</p>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5">
              Education
            </h2>
            {education.map((edu, idx) => (
              <div key={idx} className="text-xs mb-2">
                <div className="flex justify-between font-bold">
                  <span>{edu.institution}</span>
                  <span className="font-normal italic">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div>{edu.degree} in {edu.fieldOfStudy} {edu.gpa ? `(GPA: ${edu.gpa})` : ''}</div>
                {edu.coursework && <div className="text-[11px] text-gray-700">Coursework: {edu.coursework}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills && Object.keys(skills).length > 0 && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5">
              Skills
            </h2>
            <div className="text-xs space-y-0.5">
              {skills.technical?.length > 0 && <p><strong>Languages:</strong> {skills.technical.join(', ')}</p>}
              {skills.frameworks?.length > 0 && <p><strong>Frameworks:</strong> {skills.frameworks.join(', ')}</p>}
              {skills.tools?.length > 0 && <p><strong>Developer Tools:</strong> {skills.tools.join(', ')}</p>}
            </div>
          </div>
        )}

        {/* Experience */}
        {(internships.length > 0 || experience.length > 0) && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5">
              Experience
            </h2>
            {[...internships, ...experience].map((item, idx) => (
              <div key={idx} className="text-xs mb-2">
                <div className="flex justify-between font-bold">
                  <span>{item.company} – {item.role}</span>
                  <span className="font-normal italic">{item.startDate} – {item.endDate}</span>
                </div>
                {item.bullets?.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 mt-1">
                    {item.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1.5">
              Projects
            </h2>
            {projects.map((proj, idx) => (
              <div key={idx} className="text-xs mb-2">
                <div className="flex justify-between font-bold">
                  <span>{proj.title} {proj.techStack ? `(${proj.techStack})` : ''}</span>
                  <span className="font-normal italic">{proj.startDate} – {proj.endDate}</span>
                </div>
                {proj.bullets?.length > 0 && (
                  <ul className="list-disc list-outside pl-4 space-y-0.5 mt-1">
                    {proj.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Minimalist Clean Template
  return (
    <div id="resume-document" className="resume-paper w-full bg-white text-slate-800 p-8 sm:p-10 font-sans shadow-lg rounded-xl border border-slate-200 print:border-none print:shadow-none print:p-0">
      <div className="mb-5">
        <h1 className="text-3xl font-light tracking-tight text-slate-900">
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">
          {personalInfo.title || 'Software Engineer'}
        </p>
        <div className="text-[11px] text-slate-600 mt-2 flex flex-wrap gap-x-3">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.github && <span>• GitHub</span>}
          {personalInfo.linkedin && <span>• LinkedIn</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div className="mb-5">
          <p className="text-xs text-slate-600 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {skills && (
        <div className="mb-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Skills</h3>
          <p className="text-xs text-slate-700">
            {[...(skills.technical || []), ...(skills.frameworks || []), ...(skills.tools || [])].join(' • ')}
          </p>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Projects</h3>
          <div className="space-y-3">
            {projects.map((p, idx) => (
              <div key={idx} className="text-xs">
                <div className="font-semibold text-slate-900">{p.title}</div>
                <div className="text-[11px] text-slate-500 mb-1">{p.techStack}</div>
                <ul className="list-disc list-outside pl-4 space-y-1 text-slate-600">
                  {p.bullets?.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Education</h3>
          {education.map((e, idx) => (
            <div key={idx} className="text-xs">
              <span className="font-semibold text-slate-900">{e.institution}</span> — {e.degree} in {e.fieldOfStudy} ({e.startDate} – {e.endDate})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
