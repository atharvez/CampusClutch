const express = require('express');
const router = express.Router();
const { getCompetitions, getCompetitionById, createCompetition } = require('../controllers/competitionController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCompetitions);
router.get('/:id', getCompetitionById);
router.post('/', protect, authorize('admin'), createCompetition);

module.exports = router;
