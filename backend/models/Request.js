const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  receiverProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  recipientUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['join_request', 'invite'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  message: {
    type: String,
    maxlength: 200,
  },
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);
