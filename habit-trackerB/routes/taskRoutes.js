const express = require('express');
const Task = require('../models/Task');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all tasks
router.get('/', verifyToken, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json({ tasks });
});

// Create a new task
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Task name is required' });

    const newTask = new Task({ userId: req.user.id, name });
    await newTask.save();

    res.status(201).json({ message: 'Task created', task: newTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;