import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import localStorageRoutes from './routes/LocalStorageRoutes.js';
import spinWheelRoutes from './routes/spinWheelRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';

// Middleware
import { requestLogger, logSystemEvent, logError } from './middleware/loggingMiddleware.js';

// Configure environment variables
dotenv.config();

// Initialize Express
const app = express();

// Log startup
logSystemEvent('SERVER_STARTUP', { 
  environment: process.env.NODE_ENV || 'development',
  deployedOn: process.env.VERCEL === '1' ? 'Vercel' : 'Other'
});

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection caching for Vercel Serverless
let cachedDb = null;
let connectionPromise = null;

async function connectToDatabase() {
  // If we have an existing connection or pending connection, use it
  if (cachedDb) {
    return cachedDb;
  }
  
  if (connectionPromise) {
    return connectionPromise;
  }

  logSystemEvent('DB_CONNECTION_ATTEMPT', { uri: process.env.MONGODB_URI?.substring(0, 20) + '...' });

  // Create a new connection promise
  connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 15000, // Increased timeout for Vercel
    bufferCommands: false, // Disable command buffering
    connectTimeoutMS: 10000, // Connection timeout
    socketTimeoutMS: 45000, // Socket timeout
  })
  .then(db => {
    logSystemEvent('DB_CONNECTION_SUCCESS', { host: db.connection.host });
    console.log('Successfully connected to MongoDB');
    cachedDb = db;
    connectionPromise = null;
    return db;
  })
  .catch(err => {
    logError(err, { context: 'Database Connection' });
    console.error('MongoDB connection error:', err);
    
    // Log specific information for IP whitelist issues
    if (err.message && err.message.includes("whitelist")) {
      console.error('IP WHITELIST ISSUE: For Vercel deployment, you need to add 0.0.0.0/0 to your MongoDB Atlas IP Access List');
      console.error('Visit: https://www.mongodb.com/docs/atlas/security-whitelist/ for instructions');
    }
    
    connectionPromise = null;
    throw err;
  });
  
  return connectionPromise;
}

// Middleware
app.use(express.json());
app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.PRODUCTION_URL],
  credentials: true
}));

// Add request logging middleware
app.use(requestLogger);

app.get('/', (req, res) => {
  res.send(
    {
      activeStatus: true,
      error: false,
    }
  );
}
);
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/local-storage', localStorageRoutes);
app.use('/api/spin-wheel', spinWheelRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  logSystemEvent('HEALTH_CHECK', { 
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' 
  });

  res.status(200).json({ 
    status: 'healthy',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    environment: process.env.NODE_ENV || 'development',
    deployedOn: process.env.VERCEL === '1' ? 'Vercel' : 'Other'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logError(err, { 
    path: req.originalUrl,
    method: req.method,
    userId: req.user?.id || 'unauthenticated'
  });
  
  console.error(err.stack);
  
  // Special handling for MongoDB connection errors
  if (err.name === 'MongooseServerSelectionError') {
    return res.status(503).json({
      error: 'Database connection failed',
      message: 'Could not connect to MongoDB. If deploying on Vercel, ensure your MongoDB Atlas IP whitelist includes Vercel deployment IPs.',
      details: err.message
    });
  }
  
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to database at startup for non-Vercel environments
// For Vercel, we connect per-request to better work with serverless
if (process.env.VERCEL !== '1') {
  // Initialize database connection before starting
  connectToDatabase()
    .then(() => {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        logSystemEvent('SERVER_LISTENING', { port: PORT });
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`API available at http://localhost:${PORT}/api`);
      });
    })
    .catch(err => {
      logError(err, { context: 'Application Startup' });
      console.error('Failed to initialize application:', err);
      process.exit(1);
    });
} else {
  // For Vercel, we don't need to listen on a port
  // Since Vercel will invoke the exported app directly
  logSystemEvent('VERCEL_SERVERLESS_MODE', { timestamp: new Date().toISOString() });
}

// Middleware to ensure DB connection on each request in Vercel environment
if (process.env.VERCEL === '1') {
  app.use(async (req, res, next) => {
    try {
      await connectToDatabase();
      next();
    } catch (error) {
      logError(error, { 
        context: 'Vercel DB Connection',
        path: req.originalUrl
      });
      console.error('Failed to connect to database on request:', error);
      res.status(503).json({ error: 'Database connection failed', details: error.message });
    }
  });
}

// Export for Vercel Serverless Functions
export default app;
