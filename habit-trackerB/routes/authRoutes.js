import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { logAuthEvent, logError } from '../middleware/loggingMiddleware.js';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      logAuthEvent('unknown', 'REGISTER_ATTEMPT', false, { 
        reason: 'Missing required fields',
        email: email || 'not_provided'
      });
      return res.status(400).json({ message: 'All fields required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      logAuthEvent('unknown', 'REGISTER_ATTEMPT', false, { 
        reason: 'User already exists',
        email
      });
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ 
      name, 
      email, 
      password: hashedPassword,
      xp: 0,               // ensure initial XP is 0
      level: 1             // ensure initial Level is 1
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, name, email }, JWT_SECRET, { expiresIn: '24h' });

    logAuthEvent(newUser._id.toString(), 'REGISTER_SUCCESS', true, {
      name,
      email
    });

    res.status(201).json({ 
      message: 'User registered', 
      token, 
      user: { id: newUser._id, name, email, xp: 0, level: 1 } 
    });
  } catch (error) {
    logError(error, { 
      route: '/api/auth/register',
      email: req.body?.email || 'unknown'
    });
    res.status(500).json({ message: error.message });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      logAuthEvent('unknown', 'LOGIN_ATTEMPT', false, { 
        reason: 'Missing credentials',
        email: email || 'not_provided'
      });
      return res.status(400).json({ message: 'Email and password required' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      logAuthEvent('unknown', 'LOGIN_ATTEMPT', false, { 
        reason: 'User not found',
        email
      });
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logAuthEvent(user._id.toString(), 'LOGIN_ATTEMPT', false, { 
        reason: 'Invalid password',
        email
      });
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, name: user.name, email }, JWT_SECRET, { expiresIn: '24h' });

    logAuthEvent(user._id.toString(), 'LOGIN_SUCCESS', true, {
      name: user.name,
      email
    });

    res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email } });
  } catch (error) {
    logError(error, { 
      route: '/api/auth/login',
      email: req.body?.email || 'unknown'
    });
    res.status(500).json({ message: error.message });
  }
});

export default router;
