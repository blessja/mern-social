import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthState } from "../../context/AuthProvider";
import { Notify } from "../../utils";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { auth } = AuthState();

  const fetchPrivateData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/posts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      if (response.status === 200) {
        console.log("Fetched data:", response.data);
        setPosts(response.data || []);
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

  useEffect(() => {
    fetchPrivateData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container mt-4">
      <div className="row">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{post.content}</h5>
                  <p className="card-text">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
