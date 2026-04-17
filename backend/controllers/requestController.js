const Request = require('../models/Request');
const Team = require('../models/Team');
const User = require('../models/User');
const Project = require('../models/Project');
const createNotification = require('../utils/createNotification');

// @desc    Get user requests (Incoming & Outgoing)
// @route   GET /api/requests
// @access  Private
exports.getRequests = async (req, res) => {
  try {
    const userTeams = await Team.find({ 'members.user': req.user._id }).distinct('_id');
    const userProjects = await Project.find({ author: req.user._id }).distinct('_id');

    const requests = await Request.find({
      $or: [
        { sender: req.user._id },
        { recipientUser: req.user._id },
        { receiverTeam: { $in: userTeams } },
        { receiverProject: { $in: userProjects } }
      ]
    })
    .populate('sender', 'name email branch year profileImage')
    .populate('recipientUser', 'name email branch year profileImage')
    .populate('receiverTeam', 'name competition')
    .populate('receiverProject', 'title category author');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a request (Join or Invite)
// @route   POST /api/requests
// @access  Private
exports.createRequest = async (req, res) => {
  try {
    const { receiverTeam, receiverProject, recipientUser, type, message } = req.body;

    // Check for duplicate pending requests
    const query = {
      sender: req.user._id,
      type,
      status: 'pending'
    };
    if (receiverTeam) query.receiverTeam = receiverTeam;
    if (receiverProject) query.receiverProject = receiverProject;
    if (recipientUser) query.recipientUser = recipientUser;

    const existing = await Request.findOne(query);
    if (existing) return res.status(400).json({ message: 'A pending request already exists' });

    const request = await Request.create({
      sender: req.user._id,
      receiverTeam,
      receiverProject,
      recipientUser,
      type,
      message
    });

    // --- NOTIFICATIONS & EMAILS ---
    let recipientId = recipientUser;
    let targetName = '';
    
    if (!recipientId) {
      if (receiverTeam) {
        const team = await Team.findById(receiverTeam);
        const leader = team.members.find(m => m.role === 'Leader');
        recipientId = leader ? leader.user : null;
        targetName = team.name;
      } else if (receiverProject) {
        const project = await Project.findById(receiverProject);
        recipientId = project.author;
        targetName = project.title;
      }
    } else {
      if (receiverTeam) {
        const team = await Team.findById(receiverTeam);
        targetName = team.name;
      } else if (receiverProject) {
        const project = await Project.findById(receiverProject);
        targetName = project.title;
      }
    }

    if (recipientId) {
      const msg = type === 'join_request' 
        ? `${req.user.name} requested to join your ${receiverTeam ? 'team' : 'project'}: ${targetName}`
        : `You were invited to join ${receiverTeam ? 'team' : 'project'}: ${targetName}`;

      await createNotification({
        recipient: recipientId,
        sender: req.user._id,
        type: type === 'join_request' ? 'request' : 'invite',
        message: msg,
        link: '/dashboard',
        emailSubject: `New ${type.replace('_', ' ')} for ${targetName}`,
        emailHtml: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: #6200EE;">New ${type === 'invite' ? 'Invitation' : 'Request'}</h2>
            <p><strong>${req.user.name}</strong> ${type === 'invite' ? 'invited you to join' : 'wants to join'} <strong>${targetName}</strong>.</p>
            <p style="color: #666;">"${message || 'No message provided'}"</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="background: #6200EE; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 10px;">View on Dashboard</a>
          </div>
        `
      });
    }

    res.status(201).json(request);
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
    const request = await Request.findById(req.params.id)
      .populate('sender', 'name email')
      .populate('recipientUser', 'name email');

    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (status === 'accepted') {
      const userToAdd = request.type === 'join_request' ? request.sender._id : (request.recipientUser ? request.recipientUser._id : null);
      
      if (userToAdd) {
        if (request.receiverTeam) {
          const team = await Team.findById(request.receiverTeam).populate('competition');
          const isMember = team.members.find(m => m.user.toString() === userToAdd.toString());
          if (!isMember) {
            team.members.push({ user: userToAdd, role: 'Member' });
            if (team.members.length >= (team.competition ? team.competition.teamSize : 5)) {
              team.status = 'Full';
            }
            await team.save();
            await User.findByIdAndUpdate(userToAdd, { $addToSet: { joinedTeams: team._id } });
          }
        } else if (request.receiverProject) {
          const project = await Project.findById(request.receiverProject);
          if (project && !project.members.includes(userToAdd)) {
            project.members.push(userToAdd);
            if (project.members.length >= project.maxMembers) {
              project.status = 'completed'; // or full
            }
            await project.save();
          }
        }
      }
    }

    request.status = status;
    await request.save();

    // --- NOTIFICATIONS & EMAILS ---
    const recipient = request.type === 'join_request' ? request.sender : request.recipientUser;
    if (recipient) {
      let targetName = '';
      if (request.receiverTeam) {
        const team = await Team.findById(request.receiverTeam);
        targetName = team.name;
      } else if (request.receiverProject) {
        const project = await Project.findById(request.receiverProject);
        targetName = project.title;
      }

      await createNotification({
        recipient: recipient._id,
        sender: req.user._id,
        type: 'status_update',
        message: `Your request for ${targetName} was ${status}`,
        link: '/dashboard',
        emailSubject: `Update on your collaboration for ${targetName}`,
        emailHtml: `
          <div style="font-family: sans-serif; padding: 20px;">
            <h2 style="color: ${status === 'accepted' ? '#10B981' : '#EF4444'};">Update for ${targetName}</h2>
            <p>Your ${request.type === 'invite' ? 'invitation' : 'application'} was <strong>${status}</strong>.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="background: #6200EE; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 10px;">Go to Dashboard</a>
          </div>
        `
      });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
