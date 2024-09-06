const router = require("express").Router();
const { BlogPost } = require("../../models");
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

// Update a blog post by its ID
router.put("/:id", async (req, res) => {
  try {
    const blogPostData = await BlogPost.update(
      {
        blog_post_content: req.body.blog_post_content,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json(blogPostData);
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

module.exports = router;
