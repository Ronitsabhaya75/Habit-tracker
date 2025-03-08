const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Habit Tracker API!');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));