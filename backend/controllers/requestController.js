const Request = require('../models/Request');
const Team = require('../models/Team');

// @desc    Get user requests
// @route   GET /api/requests
// @access  Private
exports.getRequests = async (req, res) => {
  try {
    // Current user can be sender or member of the receiverTeam
    const requests = await Request.find({
      $or: [
        { sender: req.user._id },
        { receiverTeam: { $in: await Team.find({ 'members.user': req.user._id }).distinct('_id') } }
      ]
    }).populate('sender', 'name email').populate('receiverTeam', 'name');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update request status
// @route   PUT /api/requests/:id
// @access  Private
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Logic: If accepted, add user to team
    if (status === 'accepted') {
        const team = await Team.findById(request.receiverTeam);
        if (!team) return res.status(404).json({ message: 'Team not found' });

        // Add user to team members
        team.members.push({ user: request.sender, role: 'Member' });
        
        // If team size reached, mark as full
        const comp = await require('../models/Competition').findById(team.competition);
        if (team.members.length >= comp.teamSize) {
            team.status = 'Full';
        }
        
        await team.save();
    }

    request.status = status;
    await request.save();

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
