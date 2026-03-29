import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';
import { MdEdit,MdSchool, MdSave, MdPerson, MdWork, MdTrendingUp, MdEmojiEvents, MdCode, MdMic } from 'react-icons/md';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    skillLevel: user?.skillLevel || 'beginner',
    targetRole: user?.targetRole || 'Software Developer'
  });

  const roles = ['Software Developer', 'Web Developer', 'Data Analyst', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'Other'];

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(form);
      updateUser(res.data.user);
      setEditing(false);
      toast.success('Profile updated successfully! ✅');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const levelInfo = {
    beginner: { label: '🌱 Beginner', color: '#10b981' },
    intermediate: { label: '🚀 Intermediate', color: '#f59e0b' },
    advanced: { label: '⚡ Advanced', color: '#ef4444' }
  };

  const stats = [
    { icon: <MdCode />, label: 'Problems Solved', value: user?.totalDSASolved || 0, color: 'var(--primary-light)' },
    { icon: <MdMic />, label: 'Mock Interviews', value: user?.totalInterviews || 0, color: 'var(--secondary)' },
    { icon: <MdTrendingUp />, label: 'Resume Score', value: `${user?.resumeScore || 0}%`, color: '#f59e0b' },
    { icon: <MdEmojiEvents />, label: 'Day Streak', value: user?.streak || 0, color: '#ef4444' }
  ];

  const achievements = [
    { icon: '🏆', title: 'First Interview', desc: 'Completed first mock interview', earned: user?.totalInterviews > 0 },
    { icon: '💻', title: 'Problem Solver', desc: 'Solved 10+ DSA problems', earned: user?.totalDSASolved >= 10 },
    { icon: '🔥', title: 'On a Streak', desc: 'Maintained 3+ day streak', earned: user?.streak >= 3 },
    { icon: '📊', title: 'Resume Pro', desc: 'Got 70+ ATS score', earned: user?.resumeScore >= 70 },
    { icon: '⚡', title: 'Speed Demon', desc: 'Solved 50+ problems', earned: user?.totalDSASolved >= 50 },
    { icon: '🌟', title: 'Interview Master', desc: 'Completed 10+ interviews', earned: user?.totalInterviews >= 10 }
  ];

  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en', {
    month: 'long', year: 'numeric'
  }) : 'Recently joined';

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-title">
          <h1>👤 My Profile</h1>
          <p>Manage your account settings and view your achievements</p>
        </div>
        {!editing ? (
          <button className="btn btn-ghost" onClick={() => setEditing(true)}>
            <MdEdit /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-12">
            <button className="btn btn-outline" onClick={() => setEditing(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <><div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} /> Saving...</> : <><MdSave /> Save</>}
            </button>
          </div>
        )}
      </div>

      <div className="page-body">
        <div className="grid-2" style={{ gap: '24px', alignItems: 'start' }}>

          {/* Left: Profile Card */}
          <div>
            <div className="card mb-20" style={{ textAlign: 'center', padding: '32px' }}>
              {/* Avatar */}
              <div style={{
                width: '80px', height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px', fontWeight: '700', color: 'white',
                margin: '0 auto 16px',
                boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
                border: '3px solid rgba(99,102,241,0.3)'
              }}>
                {getInitials(user?.name)}
              </div>

              {editing ? (
                <div className="form-group" style={{ textAlign: 'left' }}>
                  <label className="form-label">Display Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
              ) : (
                <>
                  <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>{user?.name}</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    {user?.email}
                  </p>
                  <div className="flex justify-center gap-8 mb-8">
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: `${levelInfo[user?.skillLevel]?.color}20`,
                      color: levelInfo[user?.skillLevel]?.color,
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {levelInfo[user?.skillLevel]?.label}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Member since {memberSince}
                  </p>
                </>
              )}
            </div>

            {/* Edit Form */}
            {editing && (
              <div className="card mb-20">
                <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>Edit Details</h3>

                <div className="form-group">
                  <label className="form-label">Target Role</label>
                  <select
                    className="form-select"
                    value={form.targetRole}
                    onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                  >
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Skill Level</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {Object.entries(levelInfo).map(([key, info]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setForm({ ...form, skillLevel: key })}
                        style={{
                          padding: '10px',
                          border: `1.5px solid ${form.skillLevel === key ? info.color : 'var(--border)'}`,
                          borderRadius: 'var(--radius)',
                          background: form.skillLevel === key ? `${info.color}15` : 'var(--bg-primary)',
                          cursor: 'pointer',
                          fontSize: '12px',
                          color: form.skillLevel === key ? info.color : 'var(--text-muted)',
                          fontWeight: '500',
                          transition: 'var(--transition)'
                        }}
                      >
                        {info.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Info */}
            {!editing && (
              <div className="card">
                <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>Account Info</h3>
                {[
                  { icon: <MdPerson />, label: 'Name', value: user?.name },
                  { icon: <MdWork />, label: 'Target Role', value: user?.targetRole },
                  { icon: <MdSchool />, label: 'Skill Level', value: user?.skillLevel?.charAt(0).toUpperCase() + user?.skillLevel?.slice(1) },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 0',
                    borderBottom: i < 2 ? '1px solid var(--border)' : 'none'
                  }}>
                    <span style={{ color: 'var(--primary-light)', fontSize: '18px' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.label}</div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Stats + Achievements */}
          <div>
            {/* Stats */}
            <div className="card mb-20">
              <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>📈 Your Statistics</h3>
              <div className="grid-2" style={{ gap: '12px' }}>
                {stats.map((stat, i) => (
                  <div key={i} style={{
                    padding: '16px',
                    background: 'var(--bg-primary)',
                    borderRadius: 'var(--radius)',
                    textAlign: 'center',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{ fontSize: '22px', color: stat.color, marginBottom: '8px' }}>{stat.icon}</div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: stat.color, fontFamily: 'Poppins' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="card">
              <h3 style={{ fontSize: '15px', marginBottom: '16px' }}>🏆 Achievements</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {achievements.map((ach, i) => (
                  <div key={i} style={{
                    padding: '12px',
                    background: ach.earned ? 'rgba(99,102,241,0.08)' : 'var(--bg-primary)',
                    border: `1px solid ${ach.earned ? 'rgba(99,102,241,0.2)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)',
                    textAlign: 'center',
                    opacity: ach.earned ? 1 : 0.5,
                    filter: ach.earned ? 'none' : 'grayscale(1)'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '6px' }}>{ach.icon}</div>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: ach.earned ? 'var(--text-primary)' : 'var(--text-muted)', marginBottom: '3px' }}>
                      {ach.title}
                    </div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{ach.desc}</div>
                    {ach.earned && (
                      <div style={{ marginTop: '6px', fontSize: '10px', color: 'var(--primary-light)' }}>✓ Earned</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="card mt-20" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
              <h3 style={{ fontSize: '14px', marginBottom: '12px', color: '#f87171' }}>⚠️ Account Actions</h3>
              <button
                onClick={logout}
                className="btn btn-danger btn-full"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                Sign Out of Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
