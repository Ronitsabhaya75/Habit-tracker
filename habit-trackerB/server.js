import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
// Load environment variables
dotenv.config();


// Get all tasks for a user
router.get('/', verifyToken, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json({ tasks });
});

// Create a new task
router.post('/', verifyToken, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Task name is required' });

  const newTask = new Task({ userId: req.user.id, name });
  await newTask.save();

  res.status(201).json({ message: 'Task created', task: newTask });
});

// Mark task as completed
router.put('/:taskId', verifyToken, async (req, res) => {
  const { completed } = req.body;
  const task = await Task.findByIdAndUpdate(req.params.taskId, { completed }, { new: true });
  res.json({ message: 'Task updated', task });
});

// Delete a task
router.delete('/:taskId', verifyToken, async (req, res) => {
  await Task.findByIdAndDelete(req.params.taskId);
  res.json({ message: 'Task deleted' });
});

module.exports = router;
