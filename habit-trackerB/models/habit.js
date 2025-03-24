const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  xp: { type: Number, default: 10 },
});

module.exports = mongoose.model('Habit', HabitSchema);