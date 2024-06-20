const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/post");

// Create a post
router.route("/").post(createPost);

// Get all posts
router.route("/").get(getAllPosts);

// Get a single post by ID
router.route("/:postId").get(getPostById);

// Update a post
router.route("/:postId").put(updatePost);

// Delete a post
router.route("/:postId").delete(deletePost);

module.exports = router;
