import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { MdSend, MdCheckCircle, MdArrowBack, MdArrowForward, MdTrendingUp } from 'react-icons/md';

const InterviewSessionPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const fetchSession = useCallback(async () => {
    try {
      const res = await interviewAPI.getSession(sessionId);
      const s = res.data.session;
      setSession(s);
      if (s.status === 'completed') setShowResults(true);
    } catch (error) {
      toast.error('Session not found');
      navigate('/mock-interview');
    } finally {
      setLoading(false);
    }
  }, [sessionId, navigate]);

  useEffect(() => { fetchSession(); }, [fetchSession]);

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      toast.error('Please write your answer before submitting');
      return;
    }
    setSubmitting(true);
    try {
      const res = await interviewAPI.submitAnswer(sessionId, {
        questionIndex: currentQ,
        answer
      });
      setFeedback(res.data.feedback);
      toast.success('Answer evaluated! 📊');
      // Update session locally
      setSession(prev => {
        const newQ = [...prev.questions];
        newQ[currentQ] = { ...newQ[currentQ], userAnswer: answer, isAnswered: true, aiEvaluation: res.data.feedback };
        return { ...prev, questions: newQ };
      });
    } catch (error) {
      toast.error('Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentQ < session.questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setAnswer('');
      setFeedback(null);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const res = await interviewAPI.completeInterview(sessionId);
      setSession(res.data.session);
      setShowResults(true);
      toast.success('Interview completed! Check your results 🎉');
    } catch (error) {
      toast.error('Failed to complete interview');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return (
    <div className="loading-screen" style={{ minHeight: '100vh' }}>
      <div className="spinner" />
      <p className="text-muted text-sm">Loading your interview session...</p>
    </div>
  );

  if (!session) return null;

  // Results View
  if (showResults) {
    const score = session.overallScore;
    const scoreColor = score >= 8 ? '#10b981' : score >= 6 ? '#f59e0b' : score >= 4 ? '#818cf8' : '#ef4444';
    const circumference = 2 * Math.PI * 54;
    const dashOffset = circumference - (score / 10) * circumference;

    return (
      <div className="animate-fadeIn">
        <div className="page-header">
          <button onClick={() => navigate('/mock-interview')} className="btn btn-ghost btn-sm">
            <MdArrowBack /> Back
          </button>
          <div className="page-title" style={{ flex: 1, textAlign: 'center' }}>
            <h1>Interview Results 🎉</h1>
          </div>
        </div>

        <div className="page-body">
          {/* Score Circle */}
          <div className="card mb-24" style={{
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))',
            border: '1px solid rgba(99,102,241,0.15)'
          }}>
            <div style={{ display: 'inline-block', position: 'relative', marginBottom: '16px' }}>
              <svg width="128" height="128" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="54" fill="none" stroke="var(--bg-primary)" strokeWidth="10" />
                <circle
                  cx="64" cy="64" r="54"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '64px 64px', transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ fontSize: '32px', fontWeight: '800', color: scoreColor, fontFamily: 'Poppins' }}>{score}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>out of 10</span>
              </div>
            </div>
            <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>
              {score >= 8 ? '🌟 Excellent Performance!' :
               score >= 6 ? '👍 Good Job!' :
               score >= 4 ? '📈 Keep Practicing!' : '💪 Room to Grow!'}
            </h2>
            <p style={{ fontSize: '14px', maxWidth: '500px', margin: '0 auto 16px', color: 'var(--text-secondary)' }}>
              {session.overallFeedback}
            </p>
            <div className="flex justify-center gap-16">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '700', color: 'var(--primary-light)' }}>{session.role}</div>
                <div className="text-xs text-muted">Role</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span className={`badge badge-${session.difficulty?.toLowerCase()}`}>{session.difficulty}</span>
                <div className="text-xs text-muted" style={{ marginTop: '4px' }}>Level</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                  {session.questions?.filter(q => q.isAnswered).length || 0}/{session.questions?.length || 5}
                </div>
                <div className="text-xs text-muted">Answered</div>
              </div>
            </div>
          </div>

          {/* Question Reviews */}
          <h3 style={{ marginBottom: '16px', fontSize: '16px' }}>📋 Question-by-Question Review</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            {session.questions.map((q, i) => (
              <div key={i} className="card" style={{ borderLeft: `3px solid ${q.isAnswered ? (q.aiEvaluation?.score >= 7 ? '#10b981' : q.aiEvaluation?.score >= 5 ? '#f59e0b' : '#ef4444') : 'var(--border)'}` }}>
                <div className="flex items-center gap-12 mb-12">
                  <div style={{
                    width: '28px', height: '28px',
                    borderRadius: '50%',
                    background: q.isAnswered ? 'rgba(16,185,129,0.1)' : 'var(--bg-primary)',
                    border: `1px solid ${q.isAnswered ? '#10b981' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: '600',
                    color: q.isAnswered ? '#10b981' : 'var(--text-muted)',
                    flexShrink: 0
                  }}>
                    {q.isAnswered ? <MdCheckCircle /> : `Q${i + 1}`}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{q.question}</p>
                  </div>
                  {q.isAnswered && q.aiEvaluation?.score !== undefined && (
                    <div style={{
                      fontSize: '18px', fontWeight: '700',
                      color: q.aiEvaluation.score >= 7 ? '#10b981' : q.aiEvaluation.score >= 5 ? '#f59e0b' : '#ef4444'
                    }}>
                      {q.aiEvaluation.score}/10
                    </div>
                  )}
                </div>

                {q.isAnswered && (
                  <div>
                    {q.userAnswer && (
                      <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius)', marginBottom: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '4px' }}>YOUR ANSWER:</div>
                        {q.userAnswer}
                      </div>
                    )}
                    {q.aiEvaluation && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div style={{ padding: '10px', background: 'rgba(99,102,241,0.06)', borderRadius: 'var(--radius)' }}>
                          <div style={{ fontSize: '10px', color: 'var(--primary-light)', fontWeight: '600', marginBottom: '4px' }}>TECHNICAL ACCURACY</div>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{q.aiEvaluation.technicalAccuracy}</p>
                        </div>
                        <div style={{ padding: '10px', background: 'rgba(16,185,129,0.06)', borderRadius: 'var(--radius)' }}>
                          <div style={{ fontSize: '10px', color: '#10b981', fontWeight: '600', marginBottom: '4px' }}>COMMUNICATION</div>
                          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{q.aiEvaluation.communicationFeedback}</p>
                        </div>
                        {q.aiEvaluation.strengths?.length > 0 && (
                          <div style={{ padding: '10px', background: 'rgba(245,158,11,0.06)', borderRadius: 'var(--radius)', gridColumn: 'span 2' }}>
                            <div style={{ fontSize: '10px', color: '#f59e0b', fontWeight: '600', marginBottom: '6px' }}>STRENGTHS & IMPROVEMENTS</div>
                            <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
                              {q.aiEvaluation.strengths?.map((s, j) => (
                                <span key={j} style={{ fontSize: '11px', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '3px 8px', borderRadius: '10px' }}>
                                  ✓ {s}
                                </span>
                              ))}
                              {q.aiEvaluation.improvements?.map((s, j) => (
                                <span key={j} style={{ fontSize: '11px', background: 'rgba(239,68,68,0.1)', color: '#f87171', padding: '3px 8px', borderRadius: '10px' }}>
                                  ↑ {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-16">
            <button onClick={() => navigate('/mock-interview')} className="btn btn-outline btn-full">
              Try Another Interview
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-full">
              <MdTrendingUp /> View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Interview View
  const question = session.questions[currentQ];
  const isAnswered = question?.isAnswered;
  const progress = ((currentQ) / session.questions.length) * 100;
  const allAnswered = session.questions.every(q => q.isAnswered);

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <button onClick={() => { if (window.confirm('Exit interview? Your progress may be lost.')) navigate('/mock-interview'); }} className="btn btn-ghost btn-sm">
          <MdArrowBack /> Exit
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
            {session.role} Interview
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Question {currentQ + 1} of {session.questions.length}
          </div>
        </div>
        <span className={`badge badge-${session.difficulty?.toLowerCase()}`}>{session.difficulty}</span>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '3px', background: 'var(--bg-secondary)' }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--primary), var(--primary-light))',
          transition: 'width 0.5s ease'
        }} />
      </div>

      <div className="page-body" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Question Nav */}
        <div className="flex gap-8 mb-24" style={{ flexWrap: 'wrap' }}>
          {session.questions.map((q, i) => (
            <button
              key={i}
              onClick={() => { setCurrentQ(i); setFeedback(null); setAnswer(''); }}
              style={{
                width: '36px', height: '36px',
                borderRadius: '50%',
                border: `2px solid ${i === currentQ ? 'var(--primary)' : q.isAnswered ? '#10b981' : 'var(--border)'}`,
                background: i === currentQ ? 'var(--primary)' : q.isAnswered ? 'rgba(16,185,129,0.1)' : 'var(--bg-secondary)',
                color: i === currentQ ? 'white' : q.isAnswered ? '#10b981' : 'var(--text-muted)',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '13px',
                transition: 'var(--transition)'
              }}
            >
              {q.isAnswered ? '✓' : i + 1}
            </button>
          ))}
        </div>

        {/* Question Card */}
        <div className="card mb-20" style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))',
          border: '1px solid rgba(99,102,241,0.15)'
        }}>
          <div className="flex items-center gap-12 mb-12">
            <div style={{
              width: '32px', height: '32px',
              background: 'rgba(99,102,241,0.15)',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: '700', color: 'var(--primary-light)'
            }}>
              Q{currentQ + 1}
            </div>
            <span className="badge badge-primary" style={{ fontSize: '10px' }}>Technical</span>
          </div>
          <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--text-primary)', fontWeight: '500' }}>
            {question?.question}
          </p>
        </div>

        {/* Answer Area */}
        {!isAnswered ? (
          <div className="card mb-20">
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>
              Your Answer
            </label>
            <textarea
              className="form-textarea"
              placeholder="Type your detailed answer here... Explain your reasoning, use examples, mention trade-offs..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              style={{ minHeight: '160px', marginBottom: '12px' }}
            />
            <div className="flex items-center justify-between">
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {answer.trim().split(/\s+/).filter(w => w).length} words
                {answer.length < 50 && answer.length > 0 && (
                  <span style={{ color: '#f59e0b', marginLeft: '8px' }}>💡 Tip: Detailed answers score higher</span>
                )}
              </div>
              <button
                className="btn btn-primary"
                onClick={handleSubmitAnswer}
                disabled={submitting || !answer.trim()}
              >
                {submitting ? (
                  <><div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Evaluating...</>
                ) : (
                  <><MdSend /> Submit Answer</>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Show Answer + Feedback */
          <div className="card mb-20">
            <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius)', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>YOUR ANSWER:</div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {question.userAnswer || 'No answer provided'}
              </p>
            </div>

            {(feedback || question.aiEvaluation) && (() => {
              const ev = feedback || question.aiEvaluation;
              const scoreColor = ev.score >= 7 ? '#10b981' : ev.score >= 5 ? '#f59e0b' : '#ef4444';
              return (
                <div>
                  <div className="flex items-center gap-16 mb-16">
                    <div style={{
                      width: '60px', height: '60px',
                      borderRadius: '50%',
                      border: `3px solid ${scoreColor}`,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '18px', fontWeight: '800', color: scoreColor }}>{ev.score}</span>
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>/10</span>
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: scoreColor }}>
                        {ev.score >= 8 ? '🌟 Excellent!' : ev.score >= 6 ? '👍 Good!' : ev.score >= 4 ? '📈 Decent' : '💪 Keep Practicing'}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>AI Evaluation Score</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ padding: '12px', background: 'rgba(99,102,241,0.06)', borderRadius: 'var(--radius)' }}>
                      <div style={{ fontSize: '10px', fontWeight: '600', color: 'var(--primary-light)', marginBottom: '6px' }}>🎯 TECHNICAL ACCURACY</div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{ev.technicalAccuracy}</p>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(16,185,129,0.06)', borderRadius: 'var(--radius)' }}>
                      <div style={{ fontSize: '10px', fontWeight: '600', color: '#10b981', marginBottom: '6px' }}>💬 COMMUNICATION</div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{ev.communicationFeedback}</p>
                    </div>
                  </div>

                  {ev.strengths?.length > 0 && (
                    <div style={{ padding: '12px', background: 'rgba(245,158,11,0.06)', borderRadius: 'var(--radius)', marginBottom: '10px' }}>
                      <div style={{ fontSize: '10px', fontWeight: '600', color: '#f59e0b', marginBottom: '8px' }}>📌 FEEDBACK</div>
                      <div className="flex gap-8" style={{ flexWrap: 'wrap' }}>
                        {ev.strengths?.map((s, j) => (
                          <span key={j} style={{ fontSize: '11px', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '12px' }}>✓ {s}</span>
                        ))}
                        {ev.improvements?.map((s, j) => (
                          <span key={j} style={{ fontSize: '11px', background: 'rgba(239,68,68,0.1)', color: '#f87171', padding: '4px 10px', borderRadius: '12px' }}>↑ {s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-12">
          {currentQ > 0 && (
            <button
              className="btn btn-outline"
              onClick={() => { setCurrentQ(currentQ - 1); setFeedback(null); setAnswer(''); }}
            >
              <MdArrowBack /> Previous
            </button>
          )}

          {currentQ < session.questions.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={handleNext}
              style={{ marginLeft: 'auto' }}
            >
              Next Question <MdArrowForward />
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              onClick={handleComplete}
              disabled={completing}
              style={{ marginLeft: 'auto' }}
            >
              {completing ? (
                <><div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Completing...</>
              ) : (
                <><MdCheckCircle /> {allAnswered ? 'Complete Interview' : 'Submit & See Results'}</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewSessionPage;
