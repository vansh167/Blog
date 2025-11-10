const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    deleteUser, // 👈 import deleteUser
} = require('../controllers/usersController');
const protect = require('../middleware/authMiddleware');

router.route('/').get(protect, getUsers);
router.route('/:id')
    .get(protect, getUserById)
    .delete(protect, deleteUser); // 👈 add delete route

module.exports = router;
