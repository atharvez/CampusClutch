const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  requiredSkills: [{
    type: String,
  }],
  maxMembers: {
    type: Number,
    default: 5,
  },
  category: {
    type: String,
    default: 'General',
  },
  status: {
    type: String,
    enum: ['open', 'completed', 'cancelled'],
    default: 'open',
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
