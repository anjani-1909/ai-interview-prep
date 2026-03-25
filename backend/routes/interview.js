const express = require('express');
const router = express.Router();
const {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviewHistory,
  getSession
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

router.post('/start', protect, startInterview);
router.get('/history', protect, getInterviewHistory);
router.get('/:sessionId', protect, getSession);
router.post('/:sessionId/answer', protect, submitAnswer);
router.post('/:sessionId/complete', protect, completeInterview);

module.exports = router;
