const Team = require('../models/Team');
const Competition = require('../models/Competition');

// @desc    Create a team
// @route   POST /api/teams
// @access  Private
exports.createTeam = async (req, res) => {
  const { name, description, competitionId } = req.body;

  try {
    const competition = await Competition.findById(competitionId);
    if (!competition) return res.status(404).json({ message: 'Competition not found' });

    const team = await Team.create({
      name,
      description,
      competition: competitionId,
      members: [{ user: req.user._id, role: 'Leader' }],
    });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all teams for a competition
// @route   GET /api/teams/competition/:id
// @access  Public
exports.getTeamsByCompetition = async (req, res) => {
  try {
    const teams = await Team.find({ competition: req.params.id }).populate('members.user', 'name branch year profileImage');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single team detail
// @route   GET /api/teams/:id
// @access  Private
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('competition')
      .populate('members.user', 'name branch year bio skills profileImage');
    
    if (team) {
      res.json(team);
    } else {
      res.status(404).json({ message: 'Team not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
