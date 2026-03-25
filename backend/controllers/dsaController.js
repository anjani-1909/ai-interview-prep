const DSAProblem = require('../models/DSAProblem');
const User = require('../models/User');

// @desc    Add DSA Problem
// @route   POST /api/dsa
// @access  Private
const addProblem = async (req, res) => {
  try {
    const { title, difficulty, category, platform, problemLink, notes, timeTaken, status, solvedAt } = req.body;

    const problem = await DSAProblem.create({
      user: req.user._id,
      title,
      difficulty,
      category: category || 'Other',
      platform: platform || 'LeetCode',
      problemLink,
      notes,
      timeTaken,
      status: status || 'Solved',
      solvedAt: solvedAt || Date.now()
    });

    // Update user stats
    if (status === 'Solved' || !status) {
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { totalDSASolved: 1 }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Problem logged successfully! 🎯',
      problem
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all problems for user
// @route   GET /api/dsa
// @access  Private
const getProblems = async (req, res) => {
  try {
    const { difficulty, category, platform, limit = 50, page = 1 } = req.query;

    const filter = { user: req.user._id };
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    if (platform) filter.platform = platform;

    const problems = await DSAProblem.find(filter)
      .sort({ solvedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await DSAProblem.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: problems.length,
      total,
      problems
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get DSA Statistics
// @route   GET /api/dsa/stats
// @access  Private
const getDSAStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total counts by difficulty
    const difficultyStats = await DSAProblem.aggregate([
      { $match: { user: userId, status: 'Solved' } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);

    // Category distribution
    const categoryStats = await DSAProblem.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    // Weekly progress (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyProgress = await DSAProblem.aggregate([
      { $match: { user: userId, solvedAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$solvedAt' } },
          count: { $sum: 1 },
          easy: { $sum: { $cond: [{ $eq: ['$difficulty', 'Easy'] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ['$difficulty', 'Medium'] }, 1, 0] } },
          hard: { $sum: { $cond: [{ $eq: ['$difficulty', 'Hard'] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Monthly progress (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const monthlyProgress = await DSAProblem.aggregate([
      { $match: { user: userId, solvedAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$solvedAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Totals
    const totals = {
      easy: difficultyStats.find(d => d._id === 'Easy')?.count || 0,
      medium: difficultyStats.find(d => d._id === 'Medium')?.count || 0,
      hard: difficultyStats.find(d => d._id === 'Hard')?.count || 0
    };
    totals.total = totals.easy + totals.medium + totals.hard;

    // Platform stats
    const platformStats = await DSAProblem.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$platform', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totals,
        categoryStats,
        weeklyProgress,
        monthlyProgress,
        platformStats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a problem
// @route   DELETE /api/dsa/:id
// @access  Private
const deleteProblem = async (req, res) => {
  try {
    const problem = await DSAProblem.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found' });
    }

    res.status(200).json({ success: true, message: 'Problem deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addProblem, getProblems, getDSAStats, deleteProblem };
