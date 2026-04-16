const express = require('express');
const router = express.Router();
const { getRequests, updateRequestStatus, createRequest } = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getRequests);
router.post('/', protect, createRequest);
router.put('/:id', protect, updateRequestStatus);

module.exports = router;
