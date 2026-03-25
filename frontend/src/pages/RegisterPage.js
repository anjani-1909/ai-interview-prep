import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdEmail, MdLock, MdPerson, MdWork, MdSchool, MdVisibility, MdVisibilityOff } from 'react-icons/md';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    skillLevel: 'beginner',
    targetRole: 'Software Developer'
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const roles = [
    'Software Developer', 'Web Developer', 'Data Analyst',
    'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'DevOps Engineer', 'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      skillLevel: form.skillLevel,
      targetRole: form.targetRole
    });
    setLoading(false);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-bg-gradient" />

      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">🎯</div>
          <h2>Create Your Account</h2>
          <p className="subtitle">Start your journey to interview success</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-icon-wrapper">
              <MdPerson className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-icon-wrapper">
              <MdEmail className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="grid-2" style={{ gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-icon-wrapper">
                <MdLock className="input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min 6 chars"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  {showPass ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-icon-wrapper">
                <MdLock className="input-icon" />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Target Role */}
          <div className="form-group">
            <label className="form-label">Target Role</label>
            <div className="input-icon-wrapper">
              <MdWork className="input-icon" />
              <select
                className="form-select"
                value={form.targetRole}
                onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                style={{ paddingLeft: '44px' }}
              >
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {/* Skill Level */}
          <div className="form-group">
            <label className="form-label">Current Skill Level</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { value: 'beginner', label: 'Beginner', icon: '🌱', desc: '0-1 years' },
                { value: 'intermediate', label: 'Intermediate', icon: '🚀', desc: '1-3 years' },
                { value: 'advanced', label: 'Advanced', icon: '⚡', desc: '3+ years' }
              ].map(level => (
                <div
                  key={level.value}
                  onClick={() => setForm({ ...form, skillLevel: level.value })}
                  style={{
                    padding: '12px 8px',
                    border: `1.5px solid ${form.skillLevel === level.value ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    background: form.skillLevel === level.value ? 'rgba(99,102,241,0.08)' : 'var(--bg-primary)',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{level.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>{level.label}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{level.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
          >
            {loading ? (
              <><div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} /> Creating Account...</>
            ) : (
              '🎯 Create Free Account'
            )}
          </button>
        </form>

        <div className="text-center" style={{ marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: '600' }}>
            Sign in →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
