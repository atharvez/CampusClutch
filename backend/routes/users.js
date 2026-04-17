const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUsers, getUserById } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/', getUsers);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/:id', getUserById);

module.exports = router;
