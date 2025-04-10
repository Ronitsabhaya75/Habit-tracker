import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import habitRoutes from './routes/habits.js';
import gameRoutes from './routes/games.js';
import shopRoutes from './routes/shop.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 3600
}));
app.use(express.json());
app.use(morgan('dev'));

// Handle preflight requests for all routes
app.options('*', cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/shop', shopRoutes);

// Root route should be last
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Golden Warriors API!' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// For Vercel deployment
const handler = app;

export default handler; 