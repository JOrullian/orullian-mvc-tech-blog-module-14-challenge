const router = require('express').Router();
const { Comment, BlogPost } = require('../../models');
const withAuth = require('../../utils/auth');

// Create a new comment
router.post('/', withAuth, async (req, res) => {
  try {
    // Validate input
    if (!req.body.comment_text || !req.body.blog_post_id) {
      return res.status(400).json({ message: 'Comment text and blog post ID are required.' });
    }

    // Check if the blog post exists
    const blogPost = await BlogPost.findByPk(req.body.blog_post_id);
    if (!blogPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Create the new comment
    const newComment = await Comment.create({
      comment_text: req.body.comment_text,
      user_id: req.session.user_id,
      blog_post_id: req.body.blog_post_id,
    });

    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
