import { useState } from "react";
import axios from "axios";
import { AuthState } from "../../context/AuthProvider";

const PostFeed = ({ posts, updatePost, deletePost }) => {
  console.log("Rendering PostFeed with posts:", posts);

  const { auth } = AuthState();

  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");
  const [newComment, setNewComment] = useState("");

  const startEditing = (postId, currentContent) => {
    setEditingPostId(postId);
    setEditedContent(currentContent);
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditedContent("");
  };

  const handleUpdate = () => {
    updatePost(editingPostId, editedContent);
    cancelEditing();
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (response.status === 200) {
        // Update the post with the new likes
        updatePost(postId, response.data.content); // Adjust as necessary
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comment`,
        { text: newComment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (response.status === 201) {
        // Update the post with the new comment
        updatePost(postId, response.data.content); // Adjust as necessary
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div>
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{post.userId.name}</h5>
              {editingPostId === post._id ? (
                <div>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                  />
                  <button
                    className="btn btn-success mt-2"
                    onClick={handleUpdate}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary mt-2"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="card-text">{post.content}</p>
              )}
              <p className="card-text">
                <small className="text-muted">
                  Posted on {new Date(post.createdAt).toLocaleString()}
                </small>
              </p>
              <button
                className="btn btn-primary"
                onClick={() => startEditing(post._id, post.content)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger ms-2"
                onClick={() => deletePost(post._id)}
              >
                Delete
              </button>
              <button
                className="btn btn-info ms-2"
                onClick={() => handleLike(post._id)}
              >
                Like {post.likes.length}
              </button>
              <div className="mt-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  className="btn btn-secondary mt-2"
                  onClick={() => handleComment(post._id)}
                >
                  Comment
                </button>
              </div>
              <div className="mt-3">
                <h6>Comments:</h6>
                {post.comments.map((comment) => (
                  <p key={comment._id} className="card-text">
                    <strong>{comment.userId.name}</strong>: {comment.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostFeed;
