import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { MdCode, MdMic, MdDescription, MdTrendingUp, MdFlashOn, MdEmojiEvents, MdArrowForward } from 'react-icons/md';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await dashboardAPI.getDashboard();
      setDashboard(res.data.dashboard);
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const stats = dashboard?.stats || {};
  const recentProblems = dashboard?.recentProblems || [];
  const recentSessions = dashboard?.recentSessions || [];

  // Chart data
  const dsaChartData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [{
      label: 'Problems Solved',
      data: [stats.easySolved || 0, stats.mediumSolved || 0, stats.hardSolved || 0],
      backgroundColor: [
        'rgba(16, 185, 129, 0.7)',
        'rgba(245, 158, 11, 0.7)',
        'rgba(239, 68, 68, 0.7)'
      ],
      borderColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 1,
      borderRadius: 8
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#f8fafc',
        bodyColor: '#94a3b8'
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: { color: '#64748b', font: { size: 11 } }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#64748b', font: { size: 11 } },
        beginAtZero: true
      }
    }
  };

  const quickActions = [
    {
      icon: '🤖',
      title: 'Start Mock Interview',
      desc: 'AI-powered interview practice',
      path: '/mock-interview',
      color: 'purple',
      badge: 'AI Powered'
    },
    {
      icon: '📊',
      title: 'Log DSA Problem',
      desc: 'Track your daily progress',
      path: '/dsa-tracker',
      color: 'green',
      badge: 'Track'
    },
    {
      icon: '📄',
      title: 'Analyze Resume',
      desc: 'Get your ATS score',
      path: '/resume-analyzer',
      color: 'orange',
      badge: 'ATS Score'
    },
    {
      icon: '🗺️',
      title: 'View Roadmap',
      desc: 'Personalized learning path',
      path: '/roadmap',
      color: 'blue',
      badge: 'Personalized'
    }
  ];

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div className="page-title">
            <div className="skeleton" style={{ height: '24px', width: '200px' }} />
            <div className="skeleton" style={{ height: '14px', width: '150px', marginTop: '8px' }} />
          </div>
        </div>
        <div className="page-body">
          <div className="grid-4" style={{ marginBottom: '24px' }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '16px' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <h1>{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
          <p>Here's your interview preparation overview for today</p>
        </div>
        <div className="flex items-center gap-12">
          {stats.streak > 0 && (
            <div className="flex items-center gap-8" style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              padding: '8px 14px',
              borderRadius: 'var(--radius)',
              color: '#fcd34d',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              <MdFlashOn /> {stats.streak} Day Streak 🔥
            </div>
          )}
          <div style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            padding: '8px 14px',
            borderRadius: 'var(--radius)',
            fontSize: '12px',
            color: 'var(--primary-light)',
            textTransform: 'capitalize',
            fontWeight: '500'
          }}>
            {user?.skillLevel} Level
          </div>
        </div>
      </div>

      <div className="page-body">

        {/* Stats Grid */}
        <div className="grid-4 mb-24 animate-fadeInUp">
          <div className="stat-card purple">
            <div className="stat-icon purple"><MdCode style={{ color: 'var(--primary-light)' }} /></div>
            <div>
              <div className="stat-number" style={{ color: 'var(--primary-light)' }}>
                {stats.totalDSASolved || 0}
              </div>
              <div className="stat-label">DSA Problems Solved</div>
            </div>
          </div>

          <div className="stat-card green stagger-1 animate-fadeInUp">
            <div className="stat-icon green"><MdMic style={{ color: 'var(--secondary)' }} /></div>
            <div>
              <div className="stat-number" style={{ color: 'var(--secondary)' }}>
                {stats.totalInterviews || 0}
              </div>
              <div className="stat-label">Mock Interviews Done</div>
            </div>
          </div>

          <div className="stat-card orange stagger-2 animate-fadeInUp">
            <div className="stat-icon orange"><MdDescription style={{ color: '#f59e0b' }} /></div>
            <div>
              <div className="stat-number" style={{ color: '#f59e0b' }}>
                {stats.resumeScore || 0}%
              </div>
              <div className="stat-label">Resume ATS Score</div>
            </div>
          </div>

          <div className="stat-card blue stagger-3 animate-fadeInUp">
            <div className="stat-icon blue"><MdTrendingUp style={{ color: '#60a5fa' }} /></div>
            <div>
              <div className="stat-number" style={{ color: '#60a5fa' }}>
                {stats.avgInterviewScore || 0}/10
              </div>
              <div className="stat-label">Avg Interview Score</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-24">
          <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>🚀 Quick Actions</h2>
          <div className="grid-4">
            {quickActions.map((action, i) => (
              <div
                key={i}
                className="card"
                onClick={() => navigate(action.path)}
                style={{
                  cursor: 'pointer',
                  padding: '20px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  fontSize: '60px',
                  opacity: '0.05',
                  pointerEvents: 'none'
                }}>
                  {action.icon}
                </div>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{action.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {action.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  {action.desc}
                </div>
                <div className="flex items-center justify-between">
                  <span className="badge badge-primary">{action.badge}</span>
                  <MdArrowForward style={{ color: 'var(--text-muted)', fontSize: '16px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts + Recent Activity */}
        <div className="grid-2 mb-24">
          {/* DSA Chart */}
          <div className="card">
            <div className="flex justify-between items-center mb-16">
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '2px' }}>DSA Progress</h3>
                <p style={{ fontSize: '12px' }}>Problems by difficulty level</p>
              </div>
              <button
                onClick={() => navigate('/dsa-tracker')}
                className="btn btn-ghost btn-sm"
              >
                View All
              </button>
            </div>
            {stats.totalDSASolved > 0 ? (
              <>
                <Bar data={dsaChartData} options={chartOptions} height={180} />
                <div className="grid-3 mt-16">
                  <div className="text-center">
                    <div className="font-bold" style={{ color: '#10b981', fontSize: '20px' }}>
                      {stats.easySolved || 0}
                    </div>
                    <div className="text-xs text-muted">Easy</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold" style={{ color: '#f59e0b', fontSize: '20px' }}>
                      {stats.mediumSolved || 0}
                    </div>
                    <div className="text-xs text-muted">Medium</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold" style={{ color: '#ef4444', fontSize: '20px' }}>
                      {stats.hardSolved || 0}
                    </div>
                    <div className="text-xs text-muted">Hard</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <div className="empty-state-icon">📊</div>
                <p style={{ fontSize: '13px' }}>No problems logged yet. Start tracking your DSA journey!</p>
                <button onClick={() => navigate('/dsa-tracker')} className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                  Add Problem
                </button>
              </div>
            )}
          </div>

          {/* Recent Sessions */}
          <div className="card">
            <div className="flex justify-between items-center mb-16">
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '2px' }}>Recent Interviews</h3>
                <p style={{ fontSize: '12px' }}>Your latest mock interview results</p>
              </div>
              <button
                onClick={() => navigate('/mock-interview')}
                className="btn btn-ghost btn-sm"
              >
                New Interview
              </button>
            </div>

            {recentSessions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentSessions.map((session) => (
                  <div key={session._id} style={{
                    padding: '14px',
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                        {session.role}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {new Date(session.completedAt).toLocaleDateString()} •
                        <span className={`badge badge-${session.difficulty?.toLowerCase()}`} style={{ marginLeft: '6px', fontSize: '9px' }}>
                          {session.difficulty}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: session.overallScore >= 7 ? 'var(--success)' :
                               session.overallScore >= 5 ? '#f59e0b' : 'var(--danger)'
                      }}>
                        {session.overallScore}/10
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>score</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <div className="empty-state-icon">🎤</div>
                <p style={{ fontSize: '13px' }}>No interviews yet. Start your first AI mock interview!</p>
                <button onClick={() => navigate('/mock-interview')} className="btn btn-primary btn-sm" style={{ marginTop: '12px' }}>
                  Start Interview
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Problems */}
        {recentProblems.length > 0 && (
          <div className="card mb-24">
            <div className="flex justify-between items-center mb-16">
              <h3 style={{ fontSize: '16px' }}>Recently Logged Problems</h3>
              <button onClick={() => navigate('/dsa-tracker')} className="btn btn-ghost btn-sm">View All</button>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Problem</th>
                    <th>Difficulty</th>
                    <th>Category</th>
                    <th>Platform</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProblems.map((p) => (
                    <tr key={p._id}>
                      <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{p.title}</td>
                      <td>
                        <span className={`badge badge-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
                      </td>
                      <td>{p.category}</td>
                      <td>{p.platform}</td>
                      <td style={{ fontSize: '12px' }}>{new Date(p.solvedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Motivational Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(16,185,129,0.06) 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>
              <MdEmojiEvents style={{ color: '#fcd34d', verticalAlign: 'middle' }} /> Keep Going!
            </div>
            <p style={{ fontSize: '14px', maxWidth: '500px' }}>
              Consistency is the key to interview success. Practice daily, track your progress, and you'll ace your next technical interview!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
            <button onClick={() => navigate('/dsa-tracker')} className="btn btn-primary">
              Log Problem
            </button>
            <button onClick={() => navigate('/mock-interview')} className="btn btn-secondary">
              Practice Interview
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
