const express = require('express');
const router = express.Router();
const { addProblem, getProblems, getDSAStats, deleteProblem } = require('../controllers/dsaController');
const { protect } = require('../middleware/auth');

router.post('/', protect, addProblem);
router.get('/', protect, getProblems);
router.get('/stats', protect, getDSAStats);
router.delete('/:id', protect, deleteProblem);

module.exports = router;
