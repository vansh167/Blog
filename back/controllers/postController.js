const Post = require('../models/Post');

// CREATE post
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.create({
      title,
      content,
      author: req.user._id,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET all posts
exports.getPosts = async (req, res) => {
  const posts = await Post.find().populate('author', 'name email');
  res.json(posts);
};

// GET single post
exports.getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name email');
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
};

// UPDATE post
exports.updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You can only update your own posts' });
  }

  post.title = req.body.title || post.title;
  post.content = req.body.content || post.content;

  const updatedPost = await post.save();
  res.json(updatedPost);
};

// DELETE post
exports.deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'You can only delete your own posts' });
  }

  await post.remove();
  res.json({ message: 'Post removed' });
};
