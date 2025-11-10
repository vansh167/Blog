const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { updateProfile, login, signup } = require('../controllers/authController');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected route
router.put('/profile', protect, updateProfile);

module.exports = router;




