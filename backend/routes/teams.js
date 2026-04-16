const express = require('express');
const router = express.Router();
const { createTeam, getTeamsByCompetition, getTeamById } = require('../controllers/teamController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createTeam);
router.get('/competition/:id', getTeamsByCompetition);
router.get('/:id', protect, getTeamById);

module.exports = router;
