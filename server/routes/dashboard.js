const express = require('express');
const router = express.Router();
const { getStats, getTeamPerformance } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getStats);
router.get('/team-performance/:projectId', protect, getTeamPerformance);

module.exports = router;
