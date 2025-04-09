import mongoose from 'mongoose';
import user from '../models/User.js';
import habit from '../models/habit.js';
import task from '../models/Task.js';
import localData from '../models/LocalData.js';


const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    }
  );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Optional: Create indexes
    await User.init();
    await Habit.init();
    await Task.init();
    await LocalData.init();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;