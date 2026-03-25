const mongoose = require('mongoose');

const dsaProblemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Problem title is required'],
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  category: {
    type: String,
    enum: ['Array', 'String', 'LinkedList', 'Tree', 'Graph', 'DP', 'Recursion', 'Sorting', 'Searching', 'Stack', 'Queue', 'Heap', 'Hashing', 'Math', 'Other'],
    default: 'Other'
  },
  platform: {
    type: String,
    enum: ['LeetCode', 'GeeksForGeeks', 'HackerRank', 'CodeForces', 'InterviewBit', 'Other'],
    default: 'LeetCode'
  },
  problemLink: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Solved', 'Attempted', 'Review'],
    default: 'Solved'
  },
  timeTaken: {
    type: Number, // in minutes
    default: 0
  },
  solvedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
dsaProblemSchema.index({ user: 1, solvedAt: -1 });
dsaProblemSchema.index({ user: 1, difficulty: 1 });
dsaProblemSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model('DSAProblem', dsaProblemSchema);
