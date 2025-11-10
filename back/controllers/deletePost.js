const Post = require('../models/Post');

// DELETE /api/posts/:id
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Allow deletion if:
        // 1. User is the author
        // 2. User is the super admin
        if (post.author.toString() !== req.user._id.toString() && req.user.email !== 'kadmin@gmail.com') {
            return res.status(403).json({ message: 'You are not allowed to delete this post' });
        }

        await post.remove();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { deletePost };
