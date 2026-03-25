const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ CORS sabse upar (IMPORTANT FIX)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// ─── Security Middleware ─────────────────
app.use(helmet());
app.use(morgan('dev'));

// ─── Body Parser (FIXED - simple rakha)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Rate Limiting ─────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

// ─── Static Files ─────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ─────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/resume',    require('./routes/resume'));
app.use('/api/interview', require('./routes/interview'));
app.use('/api/dsa',       require('./routes/dsa'));
app.use('/api/roadmap',   require('./routes/roadmap'));

// ─── Health Check ─────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 AI Interview Prep API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ─── 404 Handler ─────────────────
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Error Handler ─────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ─── MongoDB Connection & Server Start ─────────────────
const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000   // ✅ hang fix
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});

module.exports = app;