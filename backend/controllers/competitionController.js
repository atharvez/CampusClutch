const Competition = require('../models/Competition');

// @desc    Get all competitions
// @route   GET /api/competitions
// @access  Public
exports.getCompetitions = async (req, res) => {
  try {
    const { category, skill } = req.query;
    let query = {};

    if (category) query.category = category;
    if (skill) query.requiredSkills = { $in: [skill] };

    const competitions = await Competition.find(query).populate('creator', 'name email');
    res.json(competitions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single competition
// @route   GET /api/competitions/:id
// @access  Public
exports.getCompetitionById = async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id).populate('creator', 'name email');
    if (competition) {
      res.json(competition);
    } else {
      res.status(404).json({ message: 'Competition not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create competition
// @route   POST /api/competitions
// @access  Private
exports.createCompetition = async (req, res) => {
  const { title, description, category, teamSize, deadline, requiredSkills } = req.body;

  try {
    const competition = await Competition.create({
      title,
      description,
      category,
      teamSize,
      deadline,
      requiredSkills,
      creator: req.user._id,
      isOfficial: req.user.role === 'host' || req.user.role === 'admin',
    });

    res.status(201).json(competition);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
