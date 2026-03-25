# 🚀 AI-Powered Interview Preparation Platform

[![Made with React](https://img.shields.io/badge/Frontend-React.js-61dafb?logo=react)](https://react.dev)
[![Node.js Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?logo=node.js)](https://nodejs.org)
[![MongoDB Database](https://img.shields.io/badge/Database-MongoDB-green?logo=mongodb)](https://mongodb.com)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

> A full-stack web application designed to assist students and job seekers in preparing for technical interviews efficiently using AI-powered features.

---

## 📸 Features Overview

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | JWT-based secure login & registration |
| 📊 **Dashboard** | Personalized progress overview with charts |
| 🤖 **AI Mock Interview** | Role-based questions with AI feedback |
| 📄 **Resume Analyzer** | ATS score + keyword analysis + suggestions |
| 💻 **DSA Tracker** | Log, categorize & visualize problem solving |
| 🗺️ **Learning Roadmap** | Personalized week-by-week learning plan |
| 👤 **Profile & Achievements** | User profile with gamification badges |

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **React Router v6** - Client-side routing
- **Chart.js + React-Chartjs-2** - Data visualization
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **React Icons** - Icon library
- **CSS Custom Properties** - Design system (no external CSS framework)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **Morgan** - HTTP logger
- **Express Rate Limit** - API protection

---

## 📁 Project Structure

```
ai-interview-prep/
├── 📂 frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   └── common/
│       │       ├── Sidebar.js         # Navigation sidebar
│       │       └── MobileHeader.js    # Mobile header
│       ├── context/
│       │   └── AuthContext.js         # Global auth state
│       ├── pages/
│       │   ├── LoginPage.js           # Login
│       │   ├── RegisterPage.js        # Registration
│       │   ├── DashboardPage.js       # Main dashboard
│       │   ├── DSATrackerPage.js      # DSA problem tracker
│       │   ├── MockInterviewPage.js   # Interview setup
│       │   ├── InterviewSessionPage.js # Active interview
│       │   ├── ResumeAnalyzerPage.js  # Resume analysis
│       │   ├── RoadmapPage.js         # Learning roadmap
│       │   └── ProfilePage.js         # User profile
│       ├── utils/
│       │   └── api.js                 # Axios API client
│       ├── App.js                     # Main app + routing
│       └── index.css                  # Global styles
│
├── 📂 backend/
│   ├── controllers/
│   │   ├── authController.js          # Auth logic
│   │   ├── dsaController.js           # DSA operations
│   │   ├── interviewController.js     # Interview logic
│   │   ├── resumeController.js        # Resume analysis
│   │   ├── roadmapController.js       # Roadmap data
│   │   └── userController.js          # Dashboard data
│   ├── middleware/
│   │   └── auth.js                    # JWT middleware
│   ├── models/
│   │   ├── User.js                    # User schema
│   │   ├── DSAProblem.js             # DSA problem schema
│   │   ├── InterviewSession.js        # Interview schema
│   │   └── Resume.js                  # Resume schema
│   ├── routes/
│   │   ├── auth.js                    # Auth routes
│   │   ├── users.js                   # User routes
│   │   ├── dsa.js                     # DSA routes
│   │   ├── interview.js               # Interview routes
│   │   ├── resume.js                  # Resume routes
│   │   └── roadmap.js                 # Roadmap routes
│   ├── .env.example                   # Environment template
│   ├── .env                           # Your environment vars
│   └── server.js                      # Express server
│
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js** v16+ installed → [Download](https://nodejs.org)
- **MongoDB** installed locally OR use MongoDB Atlas (free cloud)
- **Git** installed

### Step 1: Clone / Extract the Project
```bash
# If using git
git clone <repository-url>
cd ai-interview-prep

# Or just extract the ZIP file
```

### Step 2: Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your values:
# MONGO_URI=mongodb://localhost:27017/ai-interview-prep
# JWT_SECRET=your_very_long_secret_key_here
# PORT=5000

# Start backend server
npm run dev
```

✅ Backend will run on: `http://localhost:5000`

### Step 3: Setup Frontend

```bash
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

✅ Frontend will run on: `http://localhost:3000`

### Step 4: Open App
Open browser and go to: **http://localhost:3000**

1. Click "Create Free Account"
2. Register with your details
3. Start using all features!

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update-profile` | Update profile |

### DSA Tracker
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/dsa` | Add problem |
| GET | `/api/dsa` | Get all problems |
| GET | `/api/dsa/stats` | Get statistics |
| DELETE | `/api/dsa/:id` | Delete problem |

### Mock Interview
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interview/start` | Start interview |
| POST | `/api/interview/:id/answer` | Submit answer |
| POST | `/api/interview/:id/complete` | Complete interview |
| GET | `/api/interview/history` | Get history |
| GET | `/api/interview/:id` | Get session |

### Resume Analyzer
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/analyze-text` | Analyze resume |
| GET | `/api/resume/history` | Get history |
| GET | `/api/resume/:id` | Get analysis |

### Roadmap
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/roadmap` | Get roadmap |
| PUT | `/api/roadmap/skill-level` | Update level |

---

## 🎯 Topics & Concepts Used

### Frontend (React.js)
- React Functional Components
- React Hooks (useState, useEffect, useCallback, useContext)
- React Router v6 (Protected Routes, Navigate)
- Context API for Global State Management
- Custom API utilities with Axios
- Chart.js integration (Bar, Doughnut charts)
- CSS Custom Properties (Design System)
- Responsive Grid layouts
- CSS Animations & Transitions
- Component-based architecture

### Backend (Node.js + Express.js)
- RESTful API design
- MVC Architecture (Models, Views, Controllers)
- JWT Authentication & Authorization
- Middleware (auth, rate limiting, helmet, morgan)
- Password hashing with bcryptjs
- MongoDB Aggregation Pipeline
- Mongoose ODM with schemas & validation
- Error handling middleware
- CORS configuration
- Environment variables with dotenv

### Database (MongoDB)
- Mongoose Schema design
- Indexing for performance
- Aggregation Pipeline (group, sort, match)
- References between collections
- Virtuals and middleware (pre-save hooks)

### AI/Algorithm Features
- Rule-based ATS scoring algorithm
- Keyword extraction and matching
- Interview question bank (role + difficulty based)
- Automated feedback generation based on answer analysis
- Personalized roadmap generation based on skill level

### Security
- JWT token authentication
- Password hashing (bcrypt, 12 rounds)
- Rate limiting (express-rate-limit)
- Security headers (helmet.js)
- Input validation
- Protected routes (frontend + backend)

---

## 📱 App Flow

1. **User visits** → Redirected to Login/Register
2. **Register** with name, email, password, skill level, target role
3. **Login** → JWT token stored in localStorage
4. **Dashboard** → Overview of all stats, charts, quick actions
5. **DSA Tracker** → Log daily problems, view charts and stats
6. **Mock Interview** → Select role + difficulty → Answer 5 AI questions → Get AI evaluation
7. **Resume Analyzer** → Paste resume → Get ATS score + suggestions
8. **Roadmap** → View personalized weekly learning plan + resources
9. **Profile** → View achievements, edit settings

---

## 🔮 Future Enhancements

- [ ] Real-time voice interview simulation
- [ ] Video analysis of interview body language
- [ ] OpenAI GPT integration for smarter AI feedback
- [ ] Peer comparison and leaderboards
- [ ] PDF resume upload (using pdf-parse)
- [ ] Email notifications and reminders
- [ ] Company-specific interview tracks (Google, Amazon, etc.)
- [ ] Code execution sandbox for coding questions
- [ ] Progress sharing on LinkedIn

---

## 👨‍💻 About This Project

This project demonstrates:
- **Full-Stack Development** with React.js + Node.js + MongoDB
- **System Design** with modular, scalable architecture
- **AI Integration** concepts with rule-based + API-ready features
- **Security Best Practices** in web applications
- **UI/UX Design** with a professional, responsive interface

---

## 📄 License

MIT License - Feel free to use this project for learning and portfolio purposes.

---

*Built with ❤️ for interview preparation*
