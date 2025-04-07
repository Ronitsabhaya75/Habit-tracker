import mongoose from 'mongoose';

const LocalDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true,
    trim: true
  },
  key: {
    type: String,
    required: [true, 'Key is required'],
    trim: true,
    maxlength: [100, 'Key cannot exceed 100 characters']
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Value is required']
  },
  expiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index
LocalDataSchema.index({ userId: 1, key: 1 }, { unique: true });

// TTL index for auto-expiration
LocalDataSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for age in days
LocalDataSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Parse stringified JSON values
LocalDataSchema.methods.getParsedValue = function() {
  if (typeof this.value === 'string') {
    try {
      return JSON.parse(this.value);
    } catch (e) {
      return this.value;
    }
  }
  return this.value;
};

// Find or create pattern
LocalDataSchema.statics.findOrCreate = async function(userId, key, defaultValue = {}) {
  let data = await this.findOne({ userId, key });
  if (!data) {
    data = await this.create({ userId, key, value: defaultValue });
  }
  return data;
};

// Get all data for user
LocalDataSchema.statics.getAllForUser = async function(userId) {
  return this.find({ userId }).sort({ key: 1 }).lean();
};

// Update timestamp on save
LocalDataSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('LocalData', LocalDataSchema);