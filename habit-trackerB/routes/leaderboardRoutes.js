const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Get leaderboard
router.get('/', async (req, res) => {
  const leaderboard = await User.find().sort({ xp: -1 }).limit(5);
  res.json(leaderboard);
});

module.exports = router;