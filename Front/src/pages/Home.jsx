import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(savedPosts.reverse()); // newest first
  }, []);

  return (
    <div className="home-page">
      <h1>Latest Posts</h1>

      {posts.length === 0 ? (
        <p>No posts yet. <Link to="/create">Create one</Link>!</p>
      ) : (
        <div className="post-list">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              {post.image && <img src={post.image} alt={post.title} />}
              <div className="post-content">
                <h2>{post.title}</h2>
                <p className="author">By {post.author} • {post.date}</p>
                <p>{post.content.slice(0, 120)}...</p>
                <Link to={`/post/${post.id}`} className="read-btn">Read More</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
