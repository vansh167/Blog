import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);  

  const handleSubmit = (e) => {
    e.preventDefault();

    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const newPost = {
      id: Date.now(),
      title,
      content,
      image,
      author: user?.name || "Anonymous",
      date: new Date().toLocaleString(),
    };

    posts.push(newPost);
    localStorage.setItem("posts", JSON.stringify(posts));
    alert("Post created successfully!");
    navigate("/dashboard");
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

          <button type="submit" className="create-btn">Publish</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
