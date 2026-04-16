const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      branch: user.branch,
      year: user.year,
      skills: user.skills,
      bio: user.bio,
      portfolioLink: user.portfolioLink,
      githubLink: user.githubLink,
      profileImage: user.profileImage,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.branch = req.body.branch || user.branch;
    user.year = req.body.year || user.year;
    user.skills = req.body.skills || user.skills;
    user.bio = req.body.bio || user.bio;
    user.portfolioLink = req.body.portfolioLink || user.portfolioLink;
    user.githubLink = req.body.githubLink || user.githubLink;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      branch: updatedUser.branch,
      year: updatedUser.year,
      skills: updatedUser.skills,
      token: req.headers.authorization.split(' ')[1],
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Get all users (Search/Skill-based)
// @route   GET /api/users
// @access  Public
exports.getUsers = async (req, res) => {
    try {
        const { skill, query: searchText, year } = req.query;
        let query = {};
        
        if (skill) {
          query.skills = { $elemMatch: { $regex: skill, $options: 'i' } };
        }
        
        if (searchText) {
          query.$or = [
            { name: { $regex: searchText, $options: 'i' } },
            { skills: { $elemMatch: { $regex: searchText, $options: 'i' } } }
          ];
        }

        if (year) query.year = year;

        const users = await User.find(query).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
