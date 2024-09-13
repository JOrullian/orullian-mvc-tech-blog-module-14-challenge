const sequelize = require('../config/connection');
const { User, BlogPost } = require('../models');

const userData = require('./userData.json');
const blogPostData = require('./blogPostData.json');

const seedDatabase = async () => {
  try {
    console.log('Synchronizing database...');
    await sequelize.sync({ force: true });

    console.log('Seeding users...');
    const users = await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });

    console.log('Seeding blog posts...');
    for (const blogPost of blogPostData) {
      await BlogPost.create({
        ...blogPost,
        user_id: users[Math.floor(Math.random() * users.length)].id,
      });
    }

    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
};

seedDatabase();
