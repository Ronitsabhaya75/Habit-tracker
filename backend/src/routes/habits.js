import express from 'express';
import { protect } from '../middleware/auth.js';
import Habit from '../models/Habit.js';
import User from '../models/User.js';

const router = express.Router();

// Get all habits for a user
router.get('/', protect, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new habit
router.post('/', protect, async (req, res) => {
  try {
    const habit = await Habit.create({
      ...req.body,
      userId: req.user._id
    });
    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a habit
router.put('/:id', protect, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (habit.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedHabit = await Habit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedHabit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a habit
router.delete('/:id', protect, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (habit.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await habit.deleteOne();
    res.json({ message: 'Habit removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark habit as completed
router.post('/:id/complete', protect, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (habit.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCompletion = habit.completedDates.find(
      date => date.date.getTime() === today.getTime()
    );

    if (existingCompletion) {
      existingCompletion.completed = true;
    } else {
      habit.completedDates.push({
        date: today,
        completed: true
      });
    }

    // Update streak
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const wasCompletedYesterday = habit.completedDates.some(
      date => date.date.getTime() === yesterday.getTime() && date.completed
    );

    if (wasCompletedYesterday) {
      habit.streak += 1;
    } else {
      habit.streak = 1;
    }

    // Update user's experience and coins
    const user = await User.findById(req.user._id);
    user.experience += 10;
    user.coins += 5;

    // Check for level up
    const experienceNeeded = user.level * 100;
    if (user.experience >= experienceNeeded) {
      user.level += 1;
      user.experience = 0;
      user.coins += 50; // Bonus coins for leveling up
    }

    await user.save();
    await habit.save();

    res.json({
      habit,
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

export default router; 