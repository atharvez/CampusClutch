const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  competition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competition',
    required: true,
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['Leader', 'Member'],
      default: 'Member',
    },
  }],
  status: {
    type: String,
    enum: ['Open', 'Full'],
    default: 'Open',
  },
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
