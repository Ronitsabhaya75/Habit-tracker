import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import Task from '../models/Task.js';
import { logUserAction, logError } from '../middleware/loggingMiddleware.js';

const router = express.Router();

// Get all tasks for a user
router.get('/', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    logUserAction(req.user.id, 'TASKS_FETCHED', { count: tasks.length });
    res.json({ tasks });
  } catch (error) {
    logError(error, { route: '/api/tasks', userId: req.user?.id });
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Create a new task
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      logUserAction(req.user.id, 'TASK_CREATE_FAILED', { reason: 'Missing name' });
      return res.status(400).json({ message: 'Task name is required' });
    }

    const newTask = new Task({ userId: req.user.id, name });
    await newTask.save();

    logUserAction(req.user.id, 'TASK_CREATED', { 
      taskId: newTask._id.toString(), 
      name: newTask.name 
    });

    res.status(201).json({ message: 'Task created', task: newTask });
  } catch (error) {
    logError(error, { route: '/api/tasks', userId: req.user?.id });
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Mark task as completed
router.put('/:taskId', verifyToken, async (req, res) => {
  try {
    const { completed } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.taskId, { completed }, { new: true });
    
    if (!task) {
      logUserAction(req.user.id, 'TASK_UPDATE_FAILED', { 
        taskId: req.params.taskId,
        reason: 'Task not found'
      });
      return res.status(404).json({ message: 'Task not found' });
    }
    
    logUserAction(req.user.id, 'TASK_UPDATED', { 
      taskId: task._id.toString(), 
      name: task.name,
      completed: task.completed
    });
    
    res.json({ message: 'Task updated', task });
  } catch (error) {
    logError(error, { 
      route: '/api/tasks/' + req.params.taskId, 
      userId: req.user?.id 
    });
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete a task
router.delete('/:taskId', verifyToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    
    if (!task) {
      logUserAction(req.user.id, 'TASK_DELETE_FAILED', { 
        taskId: req.params.taskId,
        reason: 'Task not found'
      });
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Store task info before deletion for logging
    const taskInfo = {
      taskId: task._id.toString(),
      name: task.name
    };
    
    await Task.findByIdAndDelete(req.params.taskId);
    
    logUserAction(req.user.id, 'TASK_DELETED', taskInfo);
    
    res.json({ message: 'Task deleted' });
  } catch (error) {
    logError(error, { 
      route: '/api/tasks/' + req.params.taskId, 
      userId: req.user?.id 
    });
    res.status(500).json({ message: 'Error deleting task' });
  }
});

export default router;
