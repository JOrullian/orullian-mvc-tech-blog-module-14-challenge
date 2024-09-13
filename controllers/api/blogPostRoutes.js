const router = require("express").Router();
const { BlogPost, User, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// Create a new blog post
router.post("/", withAuth, async (req, res) => {
  try {
    const blogPostData = await BlogPost.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(blogPostData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Render page for a specific blog post with comments
router.get('/:id', async (req, res) => {
  try {
    const postData = await BlogPost.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          include: [User],
        },
      ],
    });

    if (!postData) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const post = postData.get({ plain: true });

    console.log(post);

    res.render('blogPost', {
      post,
      logged_in: req.session.logged_in,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update a blog post by its ID
router.put("/:id", withAuth, async (req, res) => {
  try {
    const [updated] = await BlogPost.update(
      { blog_post_content: req.body.blog_post_content },
      { where: { id: req.params.id, user_id: req.session.user_id } }
    );

    if (updated) {
      res.status(200).json({ message: 'Blog post updated successfully' });
    } else {
      res.status(404).json({ message: 'Blog post not found or not authorized' });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete a blog post by its ID
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const blogPostData = await BlogPost.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!blogPostData) {
      res.status(404).json({ message: "No blog post found with this id!" });
      return;
    }

    res.status(200).json(blogPostData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all blog_posts for testing
router.get('/', async (req, res) => {
  try {
    const blogPosts = await BlogPost.findAll();
    res.json(blogPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
