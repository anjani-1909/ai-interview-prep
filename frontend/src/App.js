import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DSATrackerPage from './pages/DSATrackerPage';
import MockInterviewPage from './pages/MockInterviewPage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import RoadmapPage from './pages/RoadmapPage';
import ProfilePage from './pages/ProfilePage';
import InterviewSessionPage from './pages/InterviewSessionPage';

// Components
import Sidebar from './components/common/Sidebar';
import MobileHeader from './components/common/MobileHeader';

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p className="text-muted text-sm">Loading your workspace...</p>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
    </div>
  );
  return !user ? children : <Navigate to="/dashboard" replace />;
};

// App Layout with Sidebar
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="main-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
        {children}
      </div>
      {sidebarOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 99 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155',
              borderRadius: '12px',
              fontSize: '14px'
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#f8fafc' }
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#f8fafc' }
            }
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout><DashboardPage /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/dsa-tracker" element={
            <ProtectedRoute>
              <AppLayout><DSATrackerPage /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/mock-interview" element={
            <ProtectedRoute>
              <AppLayout><MockInterviewPage /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/interview/:sessionId" element={
            <ProtectedRoute>
              <AppLayout><InterviewSessionPage /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/resume-analyzer" element={
            <ProtectedRoute>
              <AppLayout><ResumeAnalyzerPage /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/roadmap" element={
            <ProtectedRoute>
              <AppLayout><RoadmapPage /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <AppLayout><ProfilePage /></AppLayout>
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div className="loading-screen">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>404</div>
                <h2>Page Not Found</h2>
                <a href="/dashboard" className="btn btn-primary" style={{ marginTop: '20px' }}>
                  Go to Dashboard
                </a>
              </div>
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
