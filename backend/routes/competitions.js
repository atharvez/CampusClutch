const express = require('express');
const router = express.Router();
const { getCompetitions, getCompetitionById, createCompetition } = require('../controllers/competitionController');
const { protect } = require('../middleware/auth');

router.get('/', getCompetitions);
router.get('/:id', getCompetitionById);
router.post('/', protect, createCompetition);

module.exports = router;
