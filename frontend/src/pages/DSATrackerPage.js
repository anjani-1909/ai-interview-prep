import React, { useState, useEffect, useCallback } from 'react';
import { dsaAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { MdAdd, MdDelete, MdBarChart, MdCode, MdClose } from 'react-icons/md';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CATEGORIES = ['Array', 'String', 'LinkedList', 'Tree', 'Graph', 'DP', 'Recursion', 'Sorting', 'Searching', 'Stack', 'Queue', 'Heap', 'Hashing', 'Math', 'Other'];
const PLATFORMS = ['LeetCode', 'GeeksForGeeks', 'HackerRank', 'CodeForces', 'InterviewBit', 'Other'];

const DSATrackerPage = () => {
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('problems');
  const [filterDiff, setFilterDiff] = useState('All');
  const [filterCat, setFilterCat] = useState('All');

  const [form, setForm] = useState({
    title: '', difficulty: 'Easy', category: 'Array',
    platform: 'LeetCode', problemLink: '', notes: '', timeTaken: '', status: 'Solved'
  });

  const fetchData = useCallback(async () => {
    try {
      const [probRes, statsRes] = await Promise.all([
        dsaAPI.getProblems({ limit: 100 }),
        dsaAPI.getStats()
      ]);
      setProblems(probRes.data.problems);
      setStats(statsRes.data.stats);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddProblem = async (e) => {
    e.preventDefault();
    try {
      await dsaAPI.addProblem(form);
      toast.success('Problem logged! 🎯');
      setShowModal(false);
      setForm({ title: '', difficulty: 'Easy', category: 'Array', platform: 'LeetCode', problemLink: '', notes: '', timeTaken: '', status: 'Solved' });
      fetchData();
    } catch (error) {
      toast.error('Failed to add problem');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this problem?')) return;
    try {
      await dsaAPI.deleteProblem(id);
      toast.success('Problem deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredProblems = problems.filter(p => {
    if (filterDiff !== 'All' && p.difficulty !== filterDiff) return false;
    if (filterCat !== 'All' && p.category !== filterCat) return false;
    return true;
  });

  const totals = stats?.totals || {};

  const doughnutData = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [{
      data: [totals.easy || 0, totals.medium || 0, totals.hard || 0],
      backgroundColor: ['rgba(16,185,129,0.8)', 'rgba(245,158,11,0.8)', 'rgba(239,68,68,0.8)'],
      borderColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 2,
      hoverOffset: 4
    }]
  };

  const weeklyData = {
    labels: (stats?.weeklyProgress || []).map(d => {
      const date = new Date(d._id);
      return date.toLocaleDateString('en', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Easy',
        data: (stats?.weeklyProgress || []).map(d => d.easy || 0),
        backgroundColor: 'rgba(16,185,129,0.7)',
        borderRadius: 6
      },
      {
        label: 'Medium',
        data: (stats?.weeklyProgress || []).map(d => d.medium || 0),
        backgroundColor: 'rgba(245,158,11,0.7)',
        borderRadius: 6
      },
      {
        label: 'Hard',
        data: (stats?.weeklyProgress || []).map(d => d.hard || 0),
        backgroundColor: 'rgba(239,68,68,0.7)',
        borderRadius: 6
      }
    ]
  };

  const chartOpts = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#94a3b8', font: { size: 11 } } },
      tooltip: { backgroundColor: '#1e293b', borderColor: '#334155', borderWidth: 1 }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: '#64748b' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' }, beginAtZero: true }
    }
  };

  const doughnutOpts = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 16, font: { size: 11 } } },
      tooltip: { backgroundColor: '#1e293b', borderColor: '#334155', borderWidth: 1 }
    },
    cutout: '70%'
  };

  if (loading) return (
    <div>
      <div className="page-header">
        <div className="page-title"><h1>DSA Tracker</h1></div>
      </div>
      <div className="page-body">
        <div className="loading-screen" style={{ minHeight: '300px' }}>
          <div className="spinner" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-title">
          <h1>📊 DSA Tracker</h1>
          <p>Track your Data Structures & Algorithms problem-solving journey</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <MdAdd /> Log Problem
        </button>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="grid-5 mb-24">
          {[
            { label: 'Total Solved', value: totals.total || 0, color: '#818cf8', bg: 'rgba(99,102,241,0.1)' },
            { label: 'Easy', value: totals.easy || 0, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
            { label: 'Medium', value: totals.medium || 0, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
            { label: 'Hard', value: totals.hard || 0, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
            { label: 'This Week', value: (stats?.weeklyProgress?.reduce((a, d) => a + d.count, 0)) || 0, color: '#60a5fa', bg: 'rgba(59,130,246,0.1)' }
          ].map((s, i) => (
            <div key={i} style={{
              background: s.bg,
              border: `1px solid ${s.color}33`,
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: s.color, fontFamily: 'Poppins' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid-2 mb-24">
          <div className="card">
            <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>Weekly Activity</h3>
            {stats?.weeklyProgress?.length > 0 ? (
              <Bar data={weeklyData} options={{ ...chartOpts, scales: { ...chartOpts.scales, x: { ...chartOpts.scales.x, stacked: true }, y: { ...chartOpts.scales.y, stacked: true } } }} height={160} />
            ) : (
              <div className="empty-state" style={{ padding: '30px' }}>
                <p style={{ fontSize: '13px' }}>No activity this week. Start logging problems!</p>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>Difficulty Distribution</h3>
            {totals.total > 0 ? (
              <div style={{ maxWidth: '220px', margin: '0 auto' }}>
                <Doughnut data={doughnutData} options={doughnutOpts} />
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '30px' }}>
                <div className="empty-state-icon">📊</div>
                <p style={{ fontSize: '13px' }}>Add problems to see distribution chart</p>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab-btn ${activeTab === 'problems' ? 'active' : ''}`} onClick={() => setActiveTab('problems')}>
            📝 Problem Log ({filteredProblems.length})
          </button>
          <button className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
            🏷️ By Category
          </button>
        </div>

        {activeTab === 'problems' && (
          <>
            {/* Filters */}
            <div className="flex gap-12 mb-16" style={{ flexWrap: 'wrap' }}>
              <div>
                <label className="form-label">Difficulty</label>
                <div className="flex gap-8">
                  {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                    <button
                      key={d}
                      onClick={() => setFilterDiff(d)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: `1px solid ${filterDiff === d ? '#6366f1' : 'var(--border)'}`,
                        background: filterDiff === d ? 'rgba(99,102,241,0.1)' : 'transparent',
                        color: filterDiff === d ? 'var(--primary-light)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                        transition: 'var(--transition)'
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={filterCat}
                  onChange={(e) => setFilterCat(e.target.value)}
                  style={{ padding: '6px 12px', fontSize: '13px' }}
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Problems Table */}
            {filteredProblems.length > 0 ? (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Problem Title</th>
                      <th>Difficulty</th>
                      <th>Category</th>
                      <th>Platform</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProblems.map((p, i) => (
                      <tr key={p._id}>
                        <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                        <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                          {p.problemLink ? (
                            <a href={p.problemLink} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-light)' }}>
                              {p.title}
                            </a>
                          ) : p.title}
                        </td>
                        <td><span className={`badge badge-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span></td>
                        <td>
                          <span className="badge badge-primary">{p.category}</span>
                        </td>
                        <td style={{ fontSize: '12px' }}>{p.platform}</td>
                        <td>
                          <span className={`badge ${p.status === 'Solved' ? 'badge-success' : 'badge-medium'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '12px' }}>{new Date(p.solvedAt).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => handleDelete(p._id)}
                            style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '16px', padding: '4px' }}
                          >
                            <MdDelete />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon"><MdCode /></div>
                <h3>No problems logged yet</h3>
                <p>Start logging the DSA problems you solve to track your progress</p>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                  <MdAdd /> Log First Problem
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'categories' && (
          <div className="grid-3">
            {(stats?.categoryStats || []).map((cat) => (
              <div key={cat._id} className="card" style={{ padding: '16px' }}>
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {cat._id}
                  </span>
                  <span style={{ fontSize: '22px', fontWeight: '700', color: 'var(--primary-light)' }}>
                    {cat.count}
                  </span>
                </div>
                <div className="progress-bar" style={{ marginTop: '10px' }}>
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min((cat.count / totals.total) * 100, 100)}%` }}
                  />
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  {Math.round((cat.count / totals.total) * 100)}% of total
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Problem Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3>Log New Problem</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}><MdClose /></button>
            </div>

            <form onSubmit={handleAddProblem}>
              <div className="form-group">
                <label className="form-label">Problem Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Two Sum, Binary Search..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid-2" style={{ gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Difficulty *</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['Easy', 'Medium', 'Hard'].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setForm({ ...form, difficulty: d })}
                        className={`btn btn-sm ${form.difficulty === d ? (d === 'Easy' ? 'btn-secondary' : d === 'Medium' ? '' : 'btn-danger') : 'btn-outline'}`}
                        style={{
                          flex: 1,
                          background: form.difficulty === d ?
                            (d === 'Easy' ? '#10b981' : d === 'Medium' ? '#f59e0b' : '#ef4444') : '',
                          borderColor: d === 'Easy' ? '#10b981' : d === 'Medium' ? '#f59e0b' : '#ef4444',
                          color: form.difficulty === d ? 'white' : (d === 'Easy' ? '#10b981' : d === 'Medium' ? '#f59e0b' : '#ef4444')
                        }}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option>Solved</option>
                    <option>Attempted</option>
                    <option>Review</option>
                  </select>
                </div>
              </div>

              <div className="grid-2" style={{ gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Platform</label>
                  <select className="form-select" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
                    {PLATFORMS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Problem Link (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://leetcode.com/problems/..."
                  value={form.problemLink}
                  onChange={(e) => setForm({ ...form, problemLink: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  className="form-textarea"
                  placeholder="Your approach, key insights, time complexity..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  style={{ minHeight: '70px' }}
                />
              </div>

              <div className="flex gap-12">
                <button type="button" className="btn btn-outline btn-full" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-full">
                  <MdAdd /> Log Problem
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DSATrackerPage;
