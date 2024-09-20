const router = require('express').Router();
const { User } = require('../../models');

router.get('/check-login', async (req, res) => {
  console.log(req.session);
  if (req.session.logged_in) {
    res.status(200).json({ logged_in: true, user_id: req.session.user_id });
  } else {
    res.status(401).json({ logged_in: false });
  }
});

// Sign up a new user
router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(201).json(userData);
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to sign up. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { username: req.body.username } });

    if (!userData) {
      res.status(400).json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect username or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ message: 'Login successful', redirect: '/dashboard' });
    });

  } catch (err) {
    res.status(500).json(err);
  }
});


router.get('/login', (req, res) => {
  const redirect = req.query.redirect || false; // Use default value if not provided
  res.render('login', { redirect });
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
