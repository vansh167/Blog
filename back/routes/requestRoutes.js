const express = require('express');
const router = express.Router();
const {
    getRequests,
    acceptRequest,
    rejectRequest,
    createRequest,
} = require('../controllers/requestController');
const protect = require('../middleware/authMiddleware');

// Public route for new user signup request
router.post('/', createRequest);

// Admin-only routes
router.get('/', protect, getRequests);
router.put('/:id/accept', protect, acceptRequest);
router.put('/:id/reject', protect, rejectRequest);
router.route('/').post(createRequest); // 

module.exports = router;
