const router = require('express').Router();
const blogPostRoutes = require('./blogPostRoutes');
const userRoutes = require('./userRoutes');
const commentRoutes = require('./commentRoutes');

// Define the routes
router.use('/blogPosts', blogPostRoutes);
router.use('/users', userRoutes);
router.use('/comments', commentRoutes);

module.exports = router;

