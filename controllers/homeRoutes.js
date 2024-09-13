const router = require('express').Router();
const { BlogPost, User } = require('../models');
const withAuth = require('../utils/auth');

// Fetch blog posts with user information
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

    console.log(blogPosts);
    
    res.render('homepage', { blogPosts, logged_in: req.session.logged_in });
  } catch (err) {
    console.error(err); // Log the error to server console
    res.status(500).json({ message: "An error occurred while fetching blog posts." });
  }
});

module.exports = router;



// Render page for a specific blog post
router.get('/blog_posts/:id', async (req, res) => {
  try {
    const blogPostData = await BlogPost.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'], // Ensure this matches your actual column name
        },
      ],
    });

    if (!blogPostData) {
      return res.status(404).render('404', { message: 'Blog post not found' }); // Consider a custom 404 page
    }

    const blogPost = blogPostData.get({ plain: true });

    res.render('blogPost', {
      ...blogPost,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: 'An error occurred while fetching the blog post.' });
  }
});

// Use withAuth middleware to prevent access to route
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
    console.error(err); // Log error for debugging
    res.status(500).json({ message: 'An error occurred while fetching the user profile.' });
  }
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/homepage');
    return;
  }

  res.render('signup');
});

// Log out a user
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Failed to destroy session:', err);
      return res.status(500).json({ message: 'Failed to log out' });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
