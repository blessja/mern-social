const express = require("express");
const { protect } = require("../middleware/auth");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  addComment,
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
router.delete("/:postId", protect, deletePost);

router.put("/:postId/like", protect, likePost);

router.post("/:postId/comment", protect, addComment);

module.exports = router;
