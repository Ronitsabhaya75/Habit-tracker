import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
// import { fileURLToPath } from 'url';

// Import routes
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import localStorageRoutes from './routes/LocalStorageRoutes.js';
import spinWheelRoutes from './routes/spinWheelRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';

// Load environment variables
dotenv.config();


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Initialize app
const app = express();
const PORT = process.env.PORT;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Your frontend URL
  credentials: true
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/local-storage', localStorageRoutes);
app.use('/api/spin-wheel', spinWheelRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Serve localStorage-sync.js
app.get('/localStorageSync.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'golden-warriors-new/habit-tracker/public/localStorageSync.js'));
});

// Middleware to inject localStorage sync script
app.use((req, res, next) => {
  if (req.path === '/index.html' || req.path === '/') {
    const indexPath = path.join(__dirname, 'golden-warriors-new/habit-tracker/build/index.html');
    if (fs.existsSync(indexPath)) {
      try {
        let html = fs.readFileSync(indexPath, 'utf8');
        const script = '<script src="/localStorageSync.js"></script>';
        html = html.replace('</head>', script + '</head>');
        return res.send(html);
      } catch (error) {
        console.error('Error injecting script:', error);
        next();
      }
    }
  }
  next();
});

// Serve static files from React build
// const reactBuildPath = path.join(__dirname, 'golden-warriors-new/habit-tracker/build');
// app.use(express.static(reactBuildPath));

// Catch-all route for React SPA
// app.get('*', (req, res) => {
//   res.sendFile(path.join(reactBuildPath, 'index.html'));
// });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
  // console.log(`Frontend served from ${reactBuildPath}`);
});