import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { MdMic, MdArrowForward, MdHistory, MdStar } from 'react-icons/md';
import { useEffect } from 'react';

const roles = [
  { value: 'Software Developer', icon: '💻', desc: 'Algorithms, system design, OOP' },
  { value: 'Web Developer', icon: '🌐', desc: 'HTML, CSS, JS, frameworks' },
  { value: 'Data Analyst', icon: '📊', desc: 'Python, SQL, statistics, ML' },
  { value: 'Frontend Developer', icon: '🎨', desc: 'React, CSS, performance' },
  { value: 'Backend Developer', icon: '⚙️', desc: 'APIs, databases, servers' },
  { value: 'Full Stack Developer', icon: '🚀', desc: 'End-to-end development' },
  { value: 'DevOps Engineer', icon: '🔧', desc: 'Docker, CI/CD, cloud' }
];

const difficulties = [
  { value: 'Easy', color: '#10b981', bg: 'rgba(16,185,129,0.1)', desc: 'Basic concepts, beginner-friendly' },
  { value: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', desc: 'Intermediate, commonly asked' },
  { value: 'Hard', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', desc: 'Advanced, FAANG-level questions' }
];

const MockInterviewPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('Software Developer');
  const [selectedDiff, setSelectedDiff] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await interviewAPI.getHistory();
        setHistory(res.data.sessions);
      } catch (error) {
        console.error(error);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await interviewAPI.startSession({ role: selectedRole, difficulty: selectedDiff });
      const sessionId = res.data.session._id;
      toast.success('Interview started! Good luck! 🎯');
      navigate(`/interview/${sessionId}`);
    } catch (error) {
      toast.error('Failed to start interview. Please try again.');
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Excellent 🌟';
    if (score >= 6) return 'Good 👍';
    if (score >= 4) return 'Average 📈';
    return 'Needs Work 💪';
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-title">
          <h1>🤖 AI Mock Interview</h1>
          <p>Practice with AI-generated questions and get detailed feedback</p>
        </div>
      </div>

      <div className="page-body">
        <div className="grid-2" style={{ gap: '32px', alignItems: 'start' }}>

          {/* Left: Setup */}
          <div>
            {/* Role Selection */}
            <div className="card mb-24">
              <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>1. Select Your Target Role</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Questions will be tailored to your chosen role
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {roles.map((role) => (
                  <div
                    key={role.value}
                    onClick={() => setSelectedRole(role.value)}
                    style={{
                      padding: '14px 16px',
                      border: `1.5px solid ${selectedRole === role.value ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      background: selectedRole === role.value ? 'rgba(99,102,241,0.06)' : 'var(--bg-primary)',
                      transition: 'var(--transition)'
                    }}
                  >
                    <span style={{ fontSize: '22px' }}>{role.icon}</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{role.value}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{role.desc}</div>
                    </div>
                    {selectedRole === role.value && (
                      <div style={{
                        marginLeft: 'auto',
                        width: '20px', height: '20px',
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', color: 'white'
                      }}>✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="card mb-24">
              <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>2. Choose Difficulty</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Select question complexity level
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {difficulties.map((d) => (
                  <div
                    key={d.value}
                    onClick={() => setSelectedDiff(d.value)}
                    style={{
                      padding: '14px 16px',
                      border: `1.5px solid ${selectedDiff === d.value ? d.color : 'var(--border)'}`,
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      background: selectedDiff === d.value ? d.bg : 'var(--bg-primary)',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{
                      width: '12px', height: '12px', borderRadius: '50%',
                      background: d.color, flexShrink: 0
                    }} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: selectedDiff === d.value ? d.color : 'var(--text-primary)' }}>
                        {d.value}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{d.desc}</div>
                    </div>
                    {selectedDiff === d.value && (
                      <div style={{
                        marginLeft: 'auto',
                        background: d.color,
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px', height: '20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px'
                      }}>✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <div className="card" style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))',
              border: '1px solid rgba(99,102,241,0.2)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎯</div>
                <h3 style={{ marginBottom: '4px' }}>Ready to Practice?</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  You'll get 5 AI-generated questions for <strong style={{ color: 'var(--primary-light)' }}>{selectedRole}</strong> at <strong style={{ color: selectedDiff === 'Easy' ? '#10b981' : selectedDiff === 'Medium' ? '#f59e0b' : '#ef4444' }}>{selectedDiff}</strong> level
                </p>
              </div>
              <button
                className="btn btn-primary btn-full btn-lg"
                onClick={handleStart}
                disabled={loading}
              >
                {loading ? (
                  <><div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Preparing Questions...</>
                ) : (
                  <><MdMic /> Start Mock Interview <MdArrowForward /></>
                )}
              </button>
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span>⏱️ ~15-20 min</span>
                <span>❓ 5 Questions</span>
                <span>🤖 AI Feedback</span>
              </div>
            </div>
          </div>

          {/* Right: History */}
          <div>
            <div className="card">
              <div className="flex items-center gap-12 mb-16">
                <MdHistory style={{ fontSize: '20px', color: 'var(--primary-light)' }} />
                <h3 style={{ fontSize: '16px' }}>Interview History</h3>
              </div>

              {historyLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[1,2,3].map(i => (
                    <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '12px' }} />
                  ))}
                </div>
              ) : history.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {history.map((session) => (
                    <div
                      key={session._id}
                      style={{
                        padding: '16px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                      onClick={() => navigate(`/interview/${session._id}`)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>
                            {session.role}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                            {new Date(session.completedAt).toLocaleDateString('en', {
                              day: 'numeric', month: 'short', year: 'numeric'
                            })} • {session.questions?.length || 5} questions
                          </div>
                          <div className="flex gap-8 mt-8">
                            <span className={`badge badge-${session.difficulty?.toLowerCase()}`} style={{ fontSize: '9px' }}>
                              {session.difficulty}
                            </span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                              {getScoreLabel(session.overallScore)}
                            </span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{
                            width: '52px', height: '52px',
                            borderRadius: '50%',
                            border: `3px solid ${getScoreColor(session.overallScore)}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexDirection: 'column'
                          }}>
                            <span style={{ fontSize: '16px', fontWeight: '700', color: getScoreColor(session.overallScore) }}>
                              {session.overallScore}
                            </span>
                            <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>/10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state" style={{ padding: '40px 20px' }}>
                  <div className="empty-state-icon">🎤</div>
                  <h3>No interviews yet</h3>
                  <p>Complete your first mock interview to see results here</p>
                </div>
              )}

              {/* Tips */}
              <div style={{
                marginTop: '20px',
                padding: '14px',
                background: 'rgba(99,102,241,0.06)',
                border: '1px solid rgba(99,102,241,0.12)',
                borderRadius: 'var(--radius)'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary-light)', marginBottom: '8px' }}>
                  💡 Interview Tips
                </div>
                {[
                  'Take your time to structure your answer',
                  'Use the STAR method for behavioral questions',
                  'Think out loud - explain your reasoning',
                  'Give examples from real or hypothetical projects',
                  'Always mention trade-offs in technical decisions'
                ].map((tip, i) => (
                  <div key={i} style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', gap: '6px' }}>
                    <MdStar style={{ color: '#f59e0b', flexShrink: 0, marginTop: '1px' }} /> {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockInterviewPage;
