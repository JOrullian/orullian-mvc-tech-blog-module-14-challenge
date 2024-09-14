const router = require('express').Router();
const { User } = require('../../models');

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

      res.status(201).json(userData); // Use 201 Created for successful signup
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Failed to sign up. Please try again.' });
  }
});

// Log in a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const userData = await User.findOne({ where: { email } });

    if (!userData) {
      return res.status(400).json({ message: 'Incorrect email or password, please try again' });
    }

    const validPassword = await userData.checkPassword(password);

    if (!validPassword) {
      return res.status(400).json({ message: 'Incorrect email or password, please try again' });
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Login failed. Please try again.' });
  }
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
