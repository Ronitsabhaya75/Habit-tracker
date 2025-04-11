import mongoose from 'mongoose';
import User from '../models/User.js';
import Habit from '../models/habit.js';
import Task from '../models/Task.js';
import LocalData from '../models/LocalData.js';

// Cache the database connection between serverless function invocations
let cachedConnection = null;

const connectDB = async () => {
  // If we already have a connection, use it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using existing database connection');
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000, // Increased for Vercel
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Cache the connection
    cachedConnection = conn;
    
    // Optional: Create indexes
    await User.init();
    await Habit.init();
    await Task.init();
    await LocalData.init();
    
    return conn;
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    // In serverless environments, we don't want to exit the process
    if (process.env.VERCEL !== '1') {
      process.exit(1);
    }
    throw error; // Rethrow so the error can be handled by the caller
  }
};

export default connectDB;
