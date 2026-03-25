const express = require('express');
const router = express.Router();
const { getRoadmap, updateSkillLevel } = require('../controllers/roadmapController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getRoadmap);
router.put('/skill-level', protect, updateSkillLevel);

module.exports = router;
