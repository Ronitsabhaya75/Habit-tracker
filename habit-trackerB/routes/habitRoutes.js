import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import Habit from '../models/habit.js';
import { logUserAction, logError } from '../middleware/loggingMiddleware.js';

const router = express.Router();

// Get all habits
router.get('/', verifyToken, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user.id });
    logUserAction(req.user.id, 'HABITS_FETCHED', { count: habits.length });
    res.json({ habits });
  } catch (error) {
    logError(error, { route: '/api/habits', userId: req.user?.id });
    res.status(500).json({ message: 'Error fetching habits' });
  }
});

// Create a new habit
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      logUserAction(req.user.id, 'HABIT_CREATE_FAILED', { reason: 'Missing name' });
      return res.status(400).json({ message: 'Habit name is required' });
    }

    const newHabit = new Habit({ userId: req.user.id, name });
    await newHabit.save();

    logUserAction(req.user.id, 'HABIT_CREATED', { 
      habitId: newHabit._id.toString(), 
      name: newHabit.name 
    });

    res.status(201).json({ message: 'Habit created', habit: newHabit });
  } catch (error) {
    logError(error, { route: '/api/habits', userId: req.user?.id });
    res.status(500).json({ message: 'Error creating habit' });
  }
});

export default router;
