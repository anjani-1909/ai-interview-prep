import React, { useState, useEffect } from 'react';
import { resumeAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { MdAnalytics, MdCheckCircle, MdWarning, MdInfo, MdHistory } from 'react-icons/md';

const ScoreGauge = ({ score }) => {
  const color = score >= 75 ? '#10b981' : score >= 55 ? '#f59e0b' : score >= 35 ? '#818cf8' : '#ef4444';
  const label = score >= 75 ? 'Excellent' : score >= 55 ? 'Good' : score >= 35 ? 'Average' : 'Poor';
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg width="140" height="140" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r="54" fill="none" stroke="var(--bg-primary)" strokeWidth="10" />
          <circle
            cx="64" cy="64" r="54"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '64px 64px', transition: 'stroke-dashoffset 1.5s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <span style={{ fontSize: '32px', fontWeight: '800', color, fontFamily: 'Poppins' }}>{score}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ATS Score</span>
        </div>
      </div>
      <div style={{ marginTop: '8px' }}>
        <span style={{
          padding: '4px 14px',
          borderRadius: '20px',
          background: `${color}20`,
          color,
          fontSize: '13px',
          fontWeight: '600',
          border: `1px solid ${color}40`
        }}>
          {label}
        </span>
      </div>
    </div>
  );
};

const ResumeAnalyzerPage = () => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('analyze');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await resumeAPI.getHistory();
        setHistory(res.data.resumes);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHistory();
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim() || text.trim().length < 50) {
      toast.error('Please paste your resume content (minimum 50 characters)');
      return;
    }
    setLoading(true);
    try {
      const res = await resumeAPI.analyzeText({ text });
      setAnalysis(res.data.analysis);
      setActiveTab('results');
      toast.success('Resume analyzed successfully! 📊');
      // Refresh history
      const histRes = await resumeAPI.getHistory();
      setHistory(histRes.data.resumes);
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = {
    High: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    Medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    Low: { color: '#10b981', bg: 'rgba(16,185,129,0.1)' }
  };

  const sampleResume = `John Doe
john.doe@gmail.com | +91 9876543210 | LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe

EDUCATION
Bachelor of Technology in Computer Science
ABC University, 2020-2024 | CGPA: 8.5

TECHNICAL SKILLS
Languages: JavaScript, Python, Java, C++
Frontend: React.js, HTML5, CSS3, Bootstrap, Tailwind CSS
Backend: Node.js, Express.js, REST APIs
Databases: MongoDB, MySQL, PostgreSQL
Tools: Git, GitHub, VS Code, Postman, Docker
Others: Data Structures & Algorithms, OOP

WORK EXPERIENCE
Software Developer Intern | XYZ Tech Company | Jan 2024 - Jun 2024
- Developed RESTful APIs using Node.js and Express.js
- Built responsive web interfaces using React.js and Tailwind CSS
- Optimized database queries resulting in 30% performance improvement
- Collaborated with a team of 5 developers using Agile methodology

PROJECTS
AI Interview Prep Platform | React.js, Node.js, MongoDB
- Built full-stack web application for interview preparation
- Integrated AI features for resume analysis and mock interviews
- Implemented JWT authentication and role-based access

E-Commerce Website | React.js, Node.js, MySQL
- Developed complete e-commerce platform with payment integration
- Implemented search functionality and product filtering

ACHIEVEMENTS
- LeetCode: 200+ problems solved (Easy: 100, Medium: 80, Hard: 20)
- Participant in Smart India Hackathon 2023
- Published article on Medium about React performance optimization`;

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-title">
          <h1>📄 Resume Analyzer</h1>
          <p>Get your ATS score and actionable improvement suggestions</p>
        </div>
      </div>

      <div className="page-body">
        {/* Tabs */}
        <div className="tabs">
          <button className={`tab-btn ${activeTab === 'analyze' ? 'active' : ''}`} onClick={() => setActiveTab('analyze')}>
            📝 Analyze Resume
          </button>
          {analysis && (
            <button className={`tab-btn ${activeTab === 'results' ? 'active' : ''}`} onClick={() => setActiveTab('results')}>
              📊 Results
            </button>
          )}
          <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            <MdHistory /> History ({history.length})
          </button>
        </div>

        {activeTab === 'analyze' && (
          <div className="grid-2" style={{ gap: '24px', alignItems: 'start' }}>
            <div className="card">
              <h3 style={{ fontSize: '15px', marginBottom: '8px' }}>Paste Your Resume</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Copy and paste your resume content for instant AI analysis
              </p>
              <textarea
                className="form-textarea"
                placeholder="Paste your resume content here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ minHeight: '350px', fontFamily: 'monospace', fontSize: '12px' }}
              />
              <div className="flex justify-between items-center mt-12">
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {text.length} characters
                </div>
                <div className="flex gap-12">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setText(sampleResume)}
                  >
                    📋 Use Sample
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleAnalyze}
                    disabled={loading}
                  >
                    {loading ? (
                      <><div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Analyzing...</>
                    ) : (
                      <><MdAnalytics /> Analyze Resume</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="card mb-16" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
                <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>ℹ️ How it works</h3>
                {[
                  { icon: '1️⃣', text: 'Paste your resume content in the text box' },
                  { icon: '2️⃣', text: 'AI analyzes keywords, formatting, and content quality' },
                  { icon: '3️⃣', text: 'Get an ATS score (0-100) and detailed suggestions' },
                  { icon: '4️⃣', text: 'Implement suggestions to improve your resume' }
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <span>{step.icon}</span>
                    <span>{step.text}</span>
                  </div>
                ))}
              </div>

              <div className="card">
                <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>📊 What we analyze</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { label: 'Keywords Match', icon: '🔍', desc: 'Role-specific tech keywords' },
                    { label: 'Section Structure', icon: '📋', desc: 'Contact, Experience, Education, Skills' },
                    { label: 'Content Quality', icon: '✍️', desc: 'Action verbs, quantified achievements' },
                    { label: 'ATS Compatibility', icon: '🤖', desc: 'Format, fonts, parsing' },
                    { label: 'Missing Keywords', icon: '⚠️', desc: 'Keywords to add for your target role' }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px', background: 'var(--bg-primary)', borderRadius: '8px' }}>
                      <span style={{ fontSize: '18px' }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>{item.label}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && analysis && (
          <div>
            {/* Score + Overview */}
            <div className="grid-2 mb-24">
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '32px', justifyContent: 'center' }}>
                <ScoreGauge score={analysis.atsScore} />
                <div>
                  <h3 style={{ marginBottom: '16px' }}>Score Breakdown</h3>
                  {Object.entries(analysis.sectionScores || {}).map(([key, val]) => (
                    <div key={key} style={{ marginBottom: '10px' }}>
                      <div className="flex justify-between mb-4">
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>{val}/20</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(val / 20) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: '16px', fontSize: '15px' }}>✅ Strengths & ⚠️ Weaknesses</h3>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#10b981', marginBottom: '8px' }}>STRENGTHS</div>
                  {analysis.strengths?.length > 0 ? analysis.strengths.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <MdCheckCircle style={{ color: '#10b981', flexShrink: 0, marginTop: '1px' }} /> {s}
                    </div>
                  )) : <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No strengths found</p>}
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#ef4444', marginBottom: '8px' }}>AREAS TO IMPROVE</div>
                  {analysis.weaknesses?.length > 0 ? analysis.weaknesses.map((w, i) => (
                    <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                      <MdWarning style={{ color: '#f59e0b', flexShrink: 0, marginTop: '1px' }} /> {w}
                    </div>
                  )) : <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No major issues found</p>}
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="grid-2 mb-24">
              <div className="card">
                <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>✅ Keywords Found ({analysis.keywordsFound?.length || 0})</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {analysis.keywordsFound?.map((kw, i) => (
                    <span key={i} style={{
                      padding: '4px 10px',
                      background: 'rgba(16,185,129,0.1)',
                      color: '#10b981',
                      borderRadius: '12px',
                      fontSize: '12px',
                      border: '1px solid rgba(16,185,129,0.2)'
                    }}>
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>❌ Missing Keywords ({analysis.missingKeywords?.length || 0})</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {analysis.missingKeywords?.map((kw, i) => (
                    <span key={i} style={{
                      padding: '4px 10px',
                      background: 'rgba(239,68,68,0.1)',
                      color: '#f87171',
                      borderRadius: '12px',
                      fontSize: '12px',
                      border: '1px solid rgba(239,68,68,0.2)'
                    }}>
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div className="card mb-24">
              <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>💡 Action Items & Suggestions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {analysis.suggestions?.map((sug, i) => {
                  const pc = priorityColor[sug.priority] || priorityColor.Low;
                  return (
                    <div key={i} style={{
                      padding: '16px',
                      background: 'var(--bg-primary)',
                      border: `1px solid ${pc.color}30`,
                      borderLeft: `3px solid ${pc.color}`,
                      borderRadius: 'var(--radius)'
                    }}>
                      <div className="flex items-center gap-12 mb-8">
                        <span style={{
                          padding: '2px 8px',
                          background: pc.bg,
                          color: pc.color,
                          fontSize: '10px',
                          fontWeight: '600',
                          borderRadius: '10px',
                          textTransform: 'uppercase'
                        }}>
                          {sug.priority} Priority
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: pc.color }}>
                          {sug.category}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>Issue:</strong> {sug.issue}
                      </div>
                      <div style={{ fontSize: '13px', color: '#10b981' }}>
                        <MdInfo style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        <strong>Fix:</strong> {sug.fix}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={() => { setActiveTab('analyze'); setAnalysis(null); setText(''); }} className="btn btn-outline">
              Analyze Another Resume
            </button>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            {history.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {history.map((r) => {
                  const color = r.atsScore >= 75 ? '#10b981' : r.atsScore >= 55 ? '#f59e0b' : '#ef4444';
                  return (
                    <div key={r._id} className="card" style={{ padding: '16px 20px' }}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{r.fileName}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {new Date(r.createdAt).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '24px', fontWeight: '800', color }}>{r.atsScore}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ATS Score</div>
                          <span style={{
                            fontSize: '10px',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: `${color}20`,
                            color
                          }}>
                            {r.analysis?.overallRating}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📄</div>
                <h3>No analyses yet</h3>
                <p>Analyze your first resume to see history here</p>
                <button onClick={() => setActiveTab('analyze')} className="btn btn-primary">
                  Analyze Now
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage;
