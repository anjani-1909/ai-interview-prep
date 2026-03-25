import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

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
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
};

// DSA APIs
export const dsaAPI = {
  addProblem: (data) => api.post('/dsa', data),
  getProblems: (params) => api.get('/dsa', { params }),
  getStats: () => api.get('/dsa/stats'),
  deleteProblem: (id) => api.delete(`/dsa/${id}`),
};

// Interview APIs
export const interviewAPI = {
  startSession: (data) => api.post('/interview/start', data),
  submitAnswer: (sessionId, data) => api.post(`/interview/${sessionId}/answer`, data),
  completeInterview: (sessionId) => api.post(`/interview/${sessionId}/complete`),
  getHistory: () => api.get('/interview/history'),
  getSession: (sessionId) => api.get(`/interview/${sessionId}`),
};

// Resume APIs
export const resumeAPI = {
  analyzeText: (data) => api.post('/resume/analyze-text', data),
  getHistory: () => api.get('/resume/history'),
  getResume: (id) => api.get(`/resume/${id}`),
};

// Roadmap APIs
export const roadmapAPI = {
  getRoadmap: () => api.get('/roadmap'),
  updateSkillLevel: (data) => api.put('/roadmap/skill-level', data),
};

// Dashboard APIs
export const dashboardAPI = {
  getDashboard: () => api.get('/users/dashboard'),
};

export default api;
