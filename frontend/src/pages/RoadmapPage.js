import React, { useState, useEffect } from 'react';
import { roadmapAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MdCheckCircle, MdSchedule, MdOpenInNew, MdUpdate } from 'react-icons/md';

const RoadmapPage = () => {
  const {updateUser } = useAuth();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingLevel, setUpdatingLevel] = useState(false);
  const [expandedWeek, setExpandedWeek] = useState(0);

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const res = await roadmapAPI.getRoadmap();
      setRoadmap(res.data.roadmap);
    } catch (error) {
      toast.error('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLevel = async (level) => {
    setUpdatingLevel(true);
    try {
      await roadmapAPI.updateSkillLevel({ skillLevel: level });
      updateUser({ skillLevel: level });
      toast.success('Skill level updated! Roadmap refreshed 🎯');
      await fetchRoadmap();
    } catch (error) {
      toast.error('Failed to update skill level');
    } finally {
      setUpdatingLevel(false);
    }
  };

  if (loading) return (
    <div>
      <div className="page-header">
        <div className="page-title"><h1>Learning Roadmap</h1></div>
      </div>
      <div className="page-body">
        <div className="loading-screen" style={{ minHeight: '300px' }}>
          <div className="spinner" />
        </div>
      </div>
    </div>
  );

  const weeks = roadmap?.weeks || [];
  const userStats = roadmap?.userStats || {};
  const resources = roadmap?.suggestedResources || [];

  const levelColors = {
    beginner: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: '🌱 Beginner', desc: '0-1 years exp' },
    intermediate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: '🚀 Intermediate', desc: '1-3 years exp' },
    advanced: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: '⚡ Advanced', desc: '3+ years exp' }
  };

  const currentLevel = levelColors[roadmap?.skillLevel] || levelColors.beginner;

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-title">
          <h1>🗺️ Learning Roadmap</h1>
          <p>Your personalized step-by-step learning path</p>
        </div>
        <div style={{
          padding: '8px 16px',
          background: currentLevel.bg,
          border: `1px solid ${currentLevel.color}30`,
          borderRadius: 'var(--radius)',
          color: currentLevel.color,
          fontSize: '13px',
          fontWeight: '600'
        }}>
          {currentLevel.label}
        </div>
      </div>

      <div className="page-body">
        {/* Stats + Level Selector */}
        <div className="grid-2 mb-24" style={{ gap: '20px' }}>
          {/* Progress Stats */}
          <div className="card">
            <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>📊 Your Progress</h3>
            <div className="grid-3 mb-16">
              <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary-light)' }}>{userStats.solvedProblems || 0}</div>
                <div className="text-xs text-muted">DSA Solved</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--secondary)' }}>{userStats.totalInterviews || 0}</div>
                <div className="text-xs text-muted">Interviews</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>{userStats.completionPercentage || 0}%</div>
                <div className="text-xs text-muted">Complete</div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-4">
                <span className="text-sm text-muted">Overall Progress</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--primary-light)' }}>
                  {userStats.completionPercentage || 0}%
                </span>
              </div>
              <div className="progress-bar" style={{ height: '10px' }}>
                <div
                  className="progress-fill"
                  style={{ width: `${userStats.completionPercentage || 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Level Selector */}
          <div className="card">
            <div className="flex items-center gap-8 mb-12">
              <MdUpdate style={{ color: 'var(--primary-light)' }} />
              <h3 style={{ fontSize: '15px' }}>Update Skill Level</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['beginner', 'intermediate', 'advanced'].map((level) => {
                const lc = levelColors[level];
                const isActive = roadmap?.skillLevel === level;
                return (
                  <button
                    key={level}
                    onClick={() => !isActive && handleUpdateLevel(level)}
                    disabled={isActive || updatingLevel}
                    style={{
                      padding: '12px 16px',
                      border: `1.5px solid ${isActive ? lc.color : 'var(--border)'}`,
                      borderRadius: 'var(--radius)',
                      background: isActive ? lc.bg : 'var(--bg-primary)',
                      cursor: isActive ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: isActive ? lc.color : 'var(--text-primary)', textAlign: 'left' }}>
                        {lc.label}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'left' }}>{lc.desc}</div>
                    </div>
                    {isActive && (
                      <MdCheckCircle style={{ color: lc.color, fontSize: '20px' }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Weekly Roadmap */}
        <div className="card mb-24">
          <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>
            📅 Week-by-Week Learning Plan
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400', marginLeft: '8px' }}>
              for {roadmap?.targetRole}
            </span>
          </h3>

          <div style={{ position: 'relative' }}>
            {/* Timeline line */}
            <div style={{
              position: 'absolute',
              left: '19px',
              top: '20px',
              bottom: '20px',
              width: '2px',
              background: 'linear-gradient(to bottom, var(--primary), rgba(99,102,241,0.1))'
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {weeks.map((week, i) => {
                const isExpanded = expandedWeek === i;
                const statusColor = week.isCompleted ? '#10b981' : week.status === 'recommended' ? 'var(--primary)' : 'var(--border)';

                return (
                  <div key={i} style={{ position: 'relative', paddingLeft: '50px', marginBottom: '4px' }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute',
                      left: '8px',
                      top: '18px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: week.isCompleted ? '#10b981' : week.status === 'recommended' ? 'var(--primary)' : 'var(--bg-card)',
                      border: `2px solid ${statusColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: 'white',
                      zIndex: 1
                    }}>
                      {week.isCompleted ? '✓' : i + 1}
                    </div>

                    {/* Week Card */}
                    <div
                      style={{
                        padding: '14px 16px',
                        background: isExpanded ? 'rgba(99,102,241,0.04)' : 'var(--bg-primary)',
                        border: `1px solid ${isExpanded ? 'rgba(99,102,241,0.2)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        marginBottom: '8px'
                      }}
                      onClick={() => setExpandedWeek(isExpanded ? -1 : i)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-12">
                            <span style={{ fontSize: '11px', color: 'var(--primary-light)', fontWeight: '600' }}>
                              WEEK {week.week}
                            </span>
                            {week.status === 'recommended' && !week.isCompleted && (
                              <span style={{
                                fontSize: '9px',
                                padding: '2px 7px',
                                borderRadius: '10px',
                                background: 'rgba(99,102,241,0.1)',
                                color: 'var(--primary-light)',
                                fontWeight: '600'
                              }}>
                                RECOMMENDED
                              </span>
                            )}
                            {week.isCompleted && (
                              <span style={{
                                fontSize: '9px',
                                padding: '2px 7px',
                                borderRadius: '10px',
                                background: 'rgba(16,185,129,0.1)',
                                color: '#10b981',
                                fontWeight: '600'
                              }}>
                                IN PROGRESS
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginTop: '2px' }}>
                            {week.title}
                          </div>
                        </div>
                        <div className="flex items-center gap-12">
                          <div className="flex items-center gap-4" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            <MdSchedule /> {week.estimatedTime}
                          </div>
                          <span style={{ color: 'var(--text-muted)', fontSize: '18px', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
                            ↓
                          </span>
                        </div>
                      </div>

                      {/* Quick topics preview */}
                      {!isExpanded && (
                        <div className="flex gap-6 mt-8" style={{ flexWrap: 'wrap' }}>
                          {week.topics?.slice(0, 3).map((t, j) => (
                            <span key={j} style={{
                              fontSize: '10px',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              background: 'var(--bg-secondary)',
                              color: 'var(--text-muted)'
                            }}>
                              {t}
                            </span>
                          ))}
                          {week.topics?.length > 3 && (
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>+{week.topics.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="card animate-fadeInUp" style={{ marginBottom: '8px', padding: '16px' }}>
                        <div className="grid-2" style={{ gap: '16px' }}>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary-light)', marginBottom: '8px' }}>
                              📚 TOPICS TO COVER
                            </div>
                            {week.topics?.map((topic, j) => (
                              <div key={j} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                                <span style={{ color: 'var(--primary-light)' }}>→</span> {topic}
                              </div>
                            ))}
                          </div>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: '600', color: '#10b981', marginBottom: '8px' }}>
                              🔗 LEARNING RESOURCES
                            </div>
                            {week.resources?.map((res, j) => (
                              <div key={j} style={{ display: 'flex', gap: '8px', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)', alignItems: 'center' }}>
                                <MdOpenInNew style={{ color: '#10b981', fontSize: '14px', flexShrink: 0 }} /> {res}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(245,158,11,0.06)', borderRadius: '8px', fontSize: '12px', color: '#fcd34d' }}>
                          ⏱️ Estimated time: <strong>{week.estimatedTime}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Suggested Resources */}
        <div className="card">
          <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>🔗 Suggested Resources for {roadmap?.skillLevel} Level</h3>
          <div className="grid-4">
            {resources.map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '16px',
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  display: 'block',
                  textDecoration: 'none',
                  transition: 'var(--transition)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ fontSize: '12px', color: 'var(--primary-light)', fontWeight: '600', marginBottom: '4px' }}>
                  {res.type}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {res.name}
                </div>
                <div className="flex items-center gap-4" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  <MdOpenInNew /> Open Resource
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
