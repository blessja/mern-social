import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthState } from "../../context/AuthProvider";
import { Notify } from "../../utils";
import axios from "axios";
import PostFeed from "../../components/Posts/PostFeed";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const navigate = useNavigate();
  const { auth } = AuthState();

  useEffect(() => {
    const fetchPrivateData = async () => {
      try {
        console.log("Fetching posts with auth state:", auth);

        const response = await axios.get("http://localhost:5000/api/posts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth?.token}`,
          },
        });

        console.log("Full response:", response);
        const data = response.data;
        console.log("Fetched data:", data);

        if (response.status === 200) {
          setPosts(data || []); // Adjust based on actual response structure
          Notify("Data fetched successfully", "success");
        } else {
          navigate("/login");
          Notify("You are not authorized, please login", "error");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        localStorage.removeItem("auth");
        navigate("/login");
        Notify("Internal server error", "error");
      }
    };

    if (auth && auth.token) {
      fetchPrivateData();
    } else {
      navigate("/login");
    }
  }, [auth, navigate]);

  const createPost = async () => {
    try {
      if (!auth || !auth.userId) {
        throw new Error("User ID is not defined");
      }

      console.log("Creating post with userId:", auth.userId);

      const response = await axios.post(
        "http://localhost:5000/api/posts",
        {
          userId: auth.userId,
          content: newPostContent,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (response.status === 201) {
        setPosts([...posts, response.data]);
        setNewPostContent("");
        Notify("Post created successfully", "success");
      } else {
        Notify("Failed to create post", "error");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      Notify("Error creating post", "error");
    }
  };

  const updatePost = async (postId, updatedContent) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/posts/${postId}`,
        { content: updatedContent },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (response.status === 200) {
        setPosts(
          posts.map((post) =>
            post._id === postId ? { ...post, content: updatedContent } : post
          )
        );
        Notify("Post updated successfully", "success");
      } else {
        Notify("Failed to update post", "error");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      Notify("Error updating post", "error");
    }
  };

  const deletePost = async (postId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/posts/${postId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (response.status === 200) {
        setPosts(posts.filter((post) => post._id !== postId));
        Notify("Post deleted successfully", "success");
      } else {
        Notify("Failed to delete post", "error");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      Notify("Error deleting post", "error");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h2>Posts</h2>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Write a new post..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <button className="btn btn-primary mt-2" onClick={createPost}>
              Create Post
            </button>
          </div>
          <PostFeed
            posts={posts}
            updatePost={updatePost}
            deletePost={deletePost}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
