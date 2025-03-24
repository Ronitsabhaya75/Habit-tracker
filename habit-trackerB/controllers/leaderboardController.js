const User = require('../models/User');

// Get leaderboard (Top 10 users by XP)
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find().sort({ xp: -1 }).limit(10);
    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLeaderboard };