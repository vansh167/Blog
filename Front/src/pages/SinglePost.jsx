import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./SinglePost.css";

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const found = posts.find((p) => p.id === Number(id));
    setPost(found);
  }, [id]);

  if (!post) return <p style={{ textAlign: "center", marginTop: "40px" }}>Post not found</p>;

  return (
    <div className="single-page">
      <div className="single-container">
        {post.image && <img src={post.image} alt={post.title} />}
        <h1>{post.title}</h1>
        <p className="meta">By {post.author} • {post.date}</p>
        <p className="content">{post.content}</p>
        <Link to="/dashboard" className="back-btn">← Back to Home</Link>
      </div>
    </div>
  );
};

export default SinglePost;
