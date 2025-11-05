import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);

  // Redirect unauthenticated users
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("You must be logged in to create a post.");
      navigate("/auth", { replace: true });
      return;
    }

    try {
      setSubmitting(true);

      const API = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";

      const res = await fetch(`${API}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // must exist and be valid
        },
        body: JSON.stringify({ title, content, image }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (res.status === 401) {
        // Token failed or unauthorized
        setMessage("Session expired. Please login again.");
        logout(); // clear user context
        navigate("/auth", { replace: true });
        return;
      }

      if (!res.ok) {
        throw new Error(data.message || data.msg || data.error || "Failed to create post");
      }

      setMessage("Post created successfully!");
      navigate("/dashboard"); // redirect after success
    } catch (err) {
      setMessage(err.message || "Unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-page">
      <div className="create-container">
        <h1>Create New Post</h1>
        <form onSubmit={handleSubmit} className="create-form">
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Image URL</label>
          <input
            type="text"
            placeholder="Paste image URL (optional)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <label>Content</label>
          <textarea
            rows="6"
            placeholder="Write your post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <button type="submit" className="create-btn" disabled={submitting}>
            {submitting ? "Publishing..." : "Publish"}
          </button>

          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
