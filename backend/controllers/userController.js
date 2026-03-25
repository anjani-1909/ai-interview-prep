const User = require('../models/User');
const DSAProblem = require('../models/DSAProblem');
const InterviewSession = require('../models/InterviewSession');
const Resume = require('../models/Resume');

// @desc    Get dashboard data
// @route   GET /api/users/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // Parallel data fetching
    const [user, recentProblems, recentSessions, latestResume] = await Promise.all([
      User.findById(userId),
      DSAProblem.find({ user: userId }).sort({ solvedAt: -1 }).limit(5),
      InterviewSession.find({ user: userId, status: 'completed' }).sort({ completedAt: -1 }).limit(3),
      Resume.findOne({ user: userId, isAnalyzed: true }).sort({ createdAt: -1 })
    ]);

    // Calculate streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todaysProblems = await DSAProblem.countDocuments({
      user: userId,
      solvedAt: { $gte: today }
    });

    // DSA stats
    const dsaStats = await DSAProblem.aggregate([
      { $match: { user: userId, status: 'Solved' } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);

    const easyCount = dsaStats.find(d => d._id === 'Easy')?.count || 0;
    const mediumCount = dsaStats.find(d => d._id === 'Medium')?.count || 0;
    const hardCount = dsaStats.find(d => d._id === 'Hard')?.count || 0;

    // Interview average score
    const avgScoreResult = await InterviewSession.aggregate([
      { $match: { user: userId, status: 'completed' } },
      { $group: { _id: null, avgScore: { $avg: '$overallScore' } } }
    ]);
    const avgInterviewScore = Math.round(avgScoreResult[0]?.avgScore || 0);

    // Weekly activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyActivity = await DSAProblem.aggregate([
      { $match: { user: userId, solvedAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%a', date: '$solvedAt' } },
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        user: {
          name: user.name,
          email: user.email,
          skillLevel: user.skillLevel,
          targetRole: user.targetRole,
          streak: user.streak,
          memberSince: user.createdAt
        },
        stats: {
          totalDSASolved: easyCount + mediumCount + hardCount,
          easySolved: easyCount,
          mediumSolved: mediumCount,
          hardSolved: hardCount,
          totalInterviews: user.totalInterviews,
          avgInterviewScore,
          resumeScore: latestResume?.atsScore || 0,
          streak: user.streak,
          todaysProblems
        },
        recentProblems,
        recentSessions: recentSessions.map(s => ({
          _id: s._id,
          role: s.role,
          difficulty: s.difficulty,
          overallScore: s.overallScore,
          completedAt: s.completedAt,
          questionsCount: s.questions.length
        })),
        resumeScore: latestResume?.atsScore || 0,
        weeklyActivity
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboard };
