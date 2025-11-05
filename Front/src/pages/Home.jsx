import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Banner from "./Banner";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const API = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";

    const load = async () => {
      try {
        const res = await fetch(`${API}/api/posts`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.msg || "Failed to fetch posts");
        // Assume backend returns array of posts with _id, title, content, image, author, createdAt
        const normalized = (Array.isArray(data) ? data : data.posts || []).slice().reverse();
        setPosts(normalized);
      } catch (e) {
        console.error("Fetch posts error:", e);
        setPosts([]);
      }
    };

    load();
  }, []);

  return (
    <>
    <Banner/>
    <div className="home-page">
      <h1>Latest Posts</h1>

      {posts.length === 0 ? (
        <p>No posts yet. <Link to="/create">Create one</Link>!</p>
      ) : (
        <div className="post-list">
          {posts.map((post) => {
            const id = post._id || post.id;
            const authorName = post.author?.name || post.author?.username || post.author || "Unknown";
            const dateStr = post.createdAt ? new Date(post.createdAt).toLocaleString() : post.date || "";
            return (
              <div key={id} className="post-card">
                {post.image && <img src={post.image} alt={post.title} />}
                <div className="post-content">
                  <h2>{post.title}</h2>
                  <p className="author">By {authorName} • {dateStr}</p>
                  <p>{(post.content || "").slice(0, 120)}...</p>
                  <Link to={`/post/${id}`} className="read-btn">Read More</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div></>
  );
};

export default Home;
