import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Please provide habit name'],
    trim: true,
    maxlength: [100, 'Habit name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  xp: {
    type: Number,
    default: 10,
    min: [1, 'XP must be at least 1']
  },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastCompleted: { type: Date }
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  category: {
    type: String,
    enum: ['health', 'work', 'learning', 'personal', 'other'],
    default: 'personal'
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for completion percentage (example)
HabitSchema.virtual('completionRate').get(function() {
  // Implementation would need tracking history
  return 0;
});

// Indexes
HabitSchema.index({ userId: 1 });
HabitSchema.index({ userId: 1, isArchived: 1 });
HabitSchema.index({ userId: 1, completed: 1 });
HabitSchema.index({ userId: 1, category: 1 });

// Update streak when habit is completed
HabitSchema.methods.updateStreak = function() {
  const now = new Date();
  const last = this.streak.lastCompleted;
  
  if (!last || this.checkStreakBroken(now, last)) {
    this.streak.current = 1;
  } else {
    this.streak.current += 1;
  }
  
  if (this.streak.current > this.streak.longest) {
    this.streak.longest = this.streak.current;
  }
  
  this.streak.lastCompleted = now;
};

// Helper method to check if streak is broken
HabitSchema.methods.checkStreakBroken = function(now, last) {
  const dayInMs = 1000 * 60 * 60 * 24;
  const daysSince = Math.floor((now - last) / dayInMs);
  
  if (this.frequency === 'daily') return daysSince > 1;
  if (this.frequency === 'weekly') return daysSince > 7;
  if (this.frequency === 'monthly') return daysSince > 30;
  return true;
};

export default mongoose.model('Habit', HabitSchema);