import { useState } from "react";

const PostFeed = ({ posts, updatePost, deletePost }) => {
  console.log("Rendering PostFeed with posts:", posts);

  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

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
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostFeed;
