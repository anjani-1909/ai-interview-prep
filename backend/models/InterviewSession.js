const mongoose = require('mongoose');

const interviewSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Software Developer', 'Web Developer', 'Data Analyst', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  questions: [{
    question: { type: String, required: true },
    userAnswer: { type: String, default: '' },
    aiEvaluation: {
      score: { type: Number, default: 0 }, // 0-10
      technicalAccuracy: { type: String, default: '' },
      communicationFeedback: { type: String, default: '' },
      suggestions: { type: String, default: '' },
      strengths: [String],
      improvements: [String]
    },
    isAnswered: { type: Boolean, default: false }
  }],
  overallScore: {
    type: Number,
    default: 0
  },
  overallFeedback: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

interviewSessionSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
