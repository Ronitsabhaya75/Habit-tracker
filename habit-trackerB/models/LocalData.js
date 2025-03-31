import mongoose from 'mongoose';

const LocalDataSchema = new mongoose.Schema({
  // User identifier - could be a browser ID or actual user ID
  userId: { 
    type: String, 
    required: true,
    index: true,
    trim: true
  },
  
  // The localStorage key
  key: { 
    type: String, 
    required: true,
    trim: true
  },
  
  // The value - can be any type
  value: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  },
  
  // When the data was last updated
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  
  // When the data was first created
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  // Automatically maintain createdAt and updatedAt fields
  timestamps: true,
  
  // Add virtual getters to JSON output
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for faster lookups and uniqueness constraint
LocalDataSchema.index({ userId: 1, key: 1 }, { unique: true });

// Add a method to safely parse string values if needed
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

// Add a static method to find or create data
LocalDataSchema.statics.findOrCreate = async function(userId, key, defaultValue = {}) {
  let data = await this.findOne({ userId, key });
  
  if (!data) {
    data = await this.create({
      userId,
      key,
      value: defaultValue
    });
  }
  
  return data;
};

//  static method to get all data for a user
LocalDataSchema.statics.getAllForUser = async function(userId) {
  return this.find({ userId }).sort({ key: 1 });
};

// virtual for data age
LocalDataSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

const LocalData = mongoose.model('LocalData', LocalDataSchema);

export default LocalData;
