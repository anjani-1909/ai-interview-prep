const express = require('express');
const router = express.Router();
const { analyzeResumeText, getResumeHistory, getResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.post('/analyze-text', protect, analyzeResumeText);
router.get('/history', protect, getResumeHistory);
router.get('/:id', protect, getResume);

module.exports = router;
