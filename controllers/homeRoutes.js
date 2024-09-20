const router = require('express').Router();
const { BlogPost, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Root route (Homepage) - display all blog posts
router.get('/', async (req, res) => {
  try {
    const blogPostData = await BlogPost.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username']
        }
      ],
    });

    const blogPosts = blogPostData.map(blogPost => blogPost.get({ plain: true }));

    res.render('homepage', { blogPosts, logged_in: req.session.logged_in });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while fetching blog posts." });
  }
});

// Dashboard route - only shows logged-in user's blog posts
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const blogPostData = await BlogPost.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username'],
        },
      ],
    });

    const blogPosts = blogPostData.map(blogPost => blogPost.get({ plain: true }));

    // Render the dashboard view with the user's blog posts
    res.render('dashboard', { blogPosts, logged_in: req.session.logged_in });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while fetching your blog posts.' });
  }
});

// Get all blog_posts for testing (optional)
router.get('/blog_posts', async (req, res) => {
  try {
    const blogPosts = await BlogPost.findAll();
    res.json(blogPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to get a specific blog post
router.get('/blog_posts/:id', async (req, res) => {
  console.log('ID Parameter:', req.params.id);
  try {
    const blogPostData = await BlogPost.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username'],
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['username'],
            },
          ],
        },
      ],
    });

    if (!blogPostData) {
      return res.status(404).render('404', { message: 'Blog post not found' });
    }

    const blogPost = blogPostData.get({ plain: true });

    res.render('blogPost', {
      post: blogPost,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error('Error in /blog_posts/:id route:', err);
    res.status(500).json({ message: 'An error occurred while fetching the blog post.' });
  }
});

// Render the create post page, but only for logged-in users
router.get('/createPost', withAuth, (req, res) => {
  try {
    res.render('createPost', { logged_in: req.session.logged_in });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Profile route (for logged-in users)
router.get('/profile', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: BlogPost }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while fetching the user profile.' });
  }
});

// Login route
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');  // Redirect to dashboard if already logged in
    return;
  }

  res.render('login');
});

// Signup route
router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');  // Redirect to dashboard if already logged in
    return;
  }

  res.render('signup');
});

module.exports = router;
