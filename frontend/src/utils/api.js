import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://ai-interview-prep-noac.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
  updateProfile: (data) => api.put('/api/auth/update-profile', data),
};

// DSA APIs
export const dsaAPI = {
  addProblem: (data) => api.post('/api/dsa', data),
  getProblems: (params) => api.get('/api/dsa', { params }),
  getStats: () => api.get('/api/dsa/stats'),
  deleteProblem: (id) => api.delete(`/api/dsa/${id}`),
};

// Interview APIs
export const interviewAPI = {
  startSession: (data) => api.post('/api/interview/start', data),
  submitAnswer: (sessionId, data) => api.post(`/api/interview/${sessionId}/answer`, data),
  completeInterview: (sessionId) => api.post(`/api/interview/${sessionId}/complete`),
  getHistory: () => api.get('/api/interview/history'),
  getSession: (sessionId) => api.get(`/api/interview/${sessionId}`),
};

// Resume APIs
export const resumeAPI = {
  analyzeText: (data) => api.post('/api/resume/analyze-text', data),
  getHistory: () => api.get('/api/resume/history'),
  getResume: (id) => api.get(`/api/resume/${id}`),
};

// Roadmap APIs
export const roadmapAPI = {
  getRoadmap: () => api.get('/api/roadmap'),
  updateSkillLevel: (data) => api.put('/api/roadmap/skill-level', data),
};

// Dashboard APIs
export const dashboardAPI = {
  getDashboard: () => api.get('/api/users/dashboard'),
};

export default api;
