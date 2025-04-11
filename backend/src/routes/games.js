import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Complete a game and earn rewards
router.post('/complete', protect, async (req, res) => {
  try {
    const { gameType, score } = req.body;
    const user = await User.findById(req.user._id);

    // Calculate rewards based on game type and score
    let coinsEarned = 0;
    let experienceEarned = 0;

    switch (gameType) {
      case 'breakthrough':
        coinsEarned = Math.floor(score * 0.5);
        experienceEarned = Math.floor(score * 0.2);
        break;
      // Add more game types here
      default:
        coinsEarned = 10;
        experienceEarned = 5;
    }

    // Update user's stats
    user.coins += coinsEarned;
    user.experience += experienceEarned;

    // Check for level up
    const experienceNeeded = user.level * 100;
    if (user.experience >= experienceNeeded) {
      user.level += 1;
      user.experience = 0;
      user.coins += 50; // Bonus coins for leveling up
    }

    await user.save();

    res.json({
      message: 'Game completed successfully',
      rewards: {
        coins: coinsEarned,
        experience: experienceEarned
      },
      user: {
        level: user.level,
        experience: user.experience,
        coins: user.coins
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's game stats
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      level: user.level,
      experience: user.experience,
      coins: user.coins,
      streak: user.streak
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 