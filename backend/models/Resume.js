const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'doc', 'docx'],
    required: true
  },
  atsScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  analysis: {
    overallRating: { type: String, default: '' }, // Poor, Average, Good, Excellent
    keywordsFound: [String],
    missingKeywords: [String],
    suggestions: [{
      category: String,
      issue: String,
      fix: String,
      priority: { type: String, enum: ['High', 'Medium', 'Low'] }
    }],
    sectionScores: {
      contactInfo: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      skills: { type: Number, default: 0 },
      formatting: { type: Number, default: 0 }
    },
    extractedText: { type: String, default: '' },
    strengths: [String],
    weaknesses: [String]
  },
  isAnalyzed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

resumeSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);
