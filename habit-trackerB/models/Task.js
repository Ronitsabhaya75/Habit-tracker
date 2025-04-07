import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Please provide task name'],
    trim: true,
    maxlength: [100, 'Task name cannot exceed 100 characters']
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
  dueDate: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  labels: [{
    type: String,
    trim: true,
    maxlength: [20, 'Label cannot exceed 20 characters']
  }],
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', null],
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for task status
TaskSchema.virtual('status').get(function() {
  if (this.completed) return 'completed';
  if (this.dueDate && this.dueDate < new Date()) return 'overdue';
  return 'pending';
});

// Indexes
TaskSchema.index({ userId: 1 });
TaskSchema.index({ userId: 1, completed: 1 });
TaskSchema.index({ userId: 1, dueDate: 1 });
TaskSchema.index({ userId: 1, priority: 1 });

// Auto-set due time to end of day if not specified
TaskSchema.pre('save', function(next) {
  if (this.dueDate && !this.dueDate.getHours()) {
    this.dueDate.setHours(23, 59, 59, 999);
  }
  next();
});

export default mongoose.model('Task', TaskSchema);