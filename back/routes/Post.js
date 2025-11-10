const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require('../controllers/postController'); // ✅ must export a function

const protect = require('../middleware/authMiddleware'); // ✅ make sure this exports a function

router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost); // ✅ both must be functions

module.exports = router;
