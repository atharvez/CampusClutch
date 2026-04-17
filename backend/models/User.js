const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\..+/, 'Please enter a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  branch: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  skills: [{
    type: String,
  }],
  bio: {
    type: String,
    maxlength: 500,
  },
  portfolioLink: String,
  githubLink: String,
  profileImage: String,
  joinedTeams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  }],
  role: {
    type: String,
    enum: ['student', 'host', 'admin'],
    default: 'student',
  },
}, { timestamps: true });

// Hash password before saving & auto-assign avatar
userSchema.pre('save', async function() {
  // Auto-generate profile image from name if not set
  if (!this.profileImage) {
    const encodedName = encodeURIComponent(this.name || 'User');
    this.profileImage = `https://ui-avatars.com/api/?name=${encodedName}&size=256&background=random&bold=true&format=png`;
  }

  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
