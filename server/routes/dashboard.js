const express = require('express');
const router = express.Router();
const { getStats, getRecentActivity, getTeamPerformance } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getStats);
router.get('/recent-activity', protect, getRecentActivity);
router.get('/team-performance/:projectId', protect, getTeamPerformance);

module.exports = router;
