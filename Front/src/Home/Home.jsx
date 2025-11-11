import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import Banner from "../Banner/Banner";

const POSTS_PER_SECTION = 6;

const Home = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    const API = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";

    const load = async () => {
      try {
        const res = await fetch(`${API}/api/posts`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.msg || "Failed to fetch posts");
        const allPosts = (Array.isArray(data) ? data : data.posts || []).slice().reverse(); // latest first

        setLatestPosts(allPosts.slice(0, POSTS_PER_SECTION));
        setPopularPosts(allPosts.slice(POSTS_PER_SECTION, POSTS_PER_SECTION * 2)); // mock popular posts
      } catch (e) {
        console.error("Fetch posts error:", e);
        setLatestPosts([]);
        setPopularPosts([]);
      }
    };

    load();
  }, []);

  const renderPostsGrid = (posts) => (
    <div className="posts-grid">
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
              <p>{(post.content || "").slice(0, 100)}...</p>
              <Link to={`/post/${id}`} className="read-btn">Read More</Link>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      <Banner />
      <div className="home-page">
        <section>
          <h1>Latest Posts</h1>
          {latestPosts.length > 0 ? renderPostsGrid(latestPosts) : <p>No latest posts found.</p>}
        </section>

        <section>
          <h1>Popular Posts</h1>
          {popularPosts.length > 0 ? renderPostsGrid(popularPosts) : <p>No popular posts found.</p>}
        </section>
      </div>
    </>
  );
};

export default Home;
