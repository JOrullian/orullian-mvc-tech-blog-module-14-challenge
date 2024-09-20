const router = require("express").Router();
const { BlogPost, User, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// Create a new blog post
router.post("/newPost", withAuth, async (req, res) => {
  console.log(req.body);

  try {    
    const blogPostData = await BlogPost.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
    });

    console.log(blogPostData);

    res.status(200).json(blogPostData);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Failed to create post', err });
  }
});

// Update a blog post by its ID
router.put("/:id", withAuth, async (req, res) => {
  try {
    const [updated] = await BlogPost.update(
      { 
        title: req.body.title,  // Allow title update as well
        content: req.body.content 
      },
      { 
        where: { 
          id: req.params.id, 
          user_id: req.session.user_id  // Ensure only the post owner can update
        } 
      }
    );

    if (updated) {
      res.status(200).json({ message: 'Blog post updated successfully' });
    } else {
      res.status(404).json({ message: 'Blog post not found or not authorized to update' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred during the update process', err });
  }
});

// Delete a blog post by its ID
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const blogPostData = await BlogPost.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id  // Ensure only the post owner can delete
      },
    });

    if (!blogPostData) {
      res.status(404).json({ message: "Blog post not found or not authorized to delete" });
      return;
    }

    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred during the deletion process", err });
  }
});

module.exports = router;
