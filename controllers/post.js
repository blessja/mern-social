const Post = require("../models/Post");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse"); // As we will handle errors using "next()"

// Create a new post
const createPost = async (req, res, next) => {
  const { userId, content } = req.body;

  try {
    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new post associated with the user
    const newPost = new Post({ userId, content });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "name");
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single post by ID
const getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId).populate("userId", "name");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a post
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const post = await Post.findByIdAndUpdate(
      postId,
      { content },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// like the post
const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// add comment
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const newComment = {
      userId,
      text,
    };

    post.comments.push(newComment);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  addComment,
};
