import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./SinglePost.css";

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const API = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/posts/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.msg || "Failed to fetch post");
        setPost(data);
      } catch (e) {
        console.error("Fetch post error:", e);
        setPost(null);
      }
    };
    if (id) load();
  }, [id]);

  if (!post)
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Post not found</p>;

  return (
    <div className="single-page-premium">
      <div className="post-container-premium">
        {post.image && (
          <div className="post-image-premium">
            <img src={post.image} alt={post.title} />
          </div>
        )}

        <div className="post-details-premium">
          <h1>{post.title}</h1>

          <div className="meta-premium">
            <span className="author">By {post.author?.name || post.author?.username || post.author || "Unknown"}</span>
            <span className="date">{post.createdAt ? new Date(post.createdAt).toLocaleString() : post.date || ""}</span>
            {post.category && <span className="category">{post.category}</span>}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="tags-premium">
              {post.tags.map((tag, i) => (
                <span key={i} className="tag">{tag}</span>
              ))}
            </div>
          )}

          <div className="content-premium">
            {(post.content || "").split("\n").map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>

          <div className="actions-premium">
            <button className="like-btn">❤️ Like</button>
            <button className="share-btn">🔗 Share</button>
            <Link to="/dashboard" className="back-btn">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
