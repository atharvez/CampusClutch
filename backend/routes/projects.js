const express = require('express');
const router = express.Router();
const { getProjects, getProjectById, createProject, updateProject } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);

module.exports = router;
