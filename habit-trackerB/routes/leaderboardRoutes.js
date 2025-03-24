const express = require('express');
const { getLeaderboard } = require('../controllers/leaderboardController');

const router = express.Router();

// Get top users by XP
router.get('/', getLeaderboard);

module.exports = router;
