const express = require('express');
const router = express.Router();
const { getUsers, getUserById } = require('../controllers/usersController');
const protect = require('../middleware/authMiddleware');

router.route('/').get(protect, getUsers);
router.route('/:id').get(protect, getUserById);

module.exports = router;
