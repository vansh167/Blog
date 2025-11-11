import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { TfiHeart } from "react-icons/tfi";
import { BsShare } from "react-icons/bs";
import { FaRegComment } from "react-icons/fa";
import "./SinglePost.css";

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const API = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";
    const load = async () => {
      try {
        const res = await fetch(`${API}/api/posts/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || data.msg || "Failed to fetch post");
        setPost(data);
        setLikeCount(data.likes || 0);
        setComments(data.comments || []);
      } catch (e) {
        console.error("Fetch post error:", e);
        setPost(null);
      }
    };
    if (id) load();
  }, [id]);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const toggleCommentSection = () => {
    setShowCommentSection((prev) => !prev);
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    setComments([...comments, newComment]);
    setNewComment("");
    setShowCommentSection(false); // hide input after submit
  };

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
            <span className="author">
              By {post.author?.name || post.author?.username || post.author || "Unknown"}
            </span>
            <span className="date">
              {post.createdAt ? new Date(post.createdAt).toLocaleString() : post.date || ""}
            </span>
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

          {/* --- INSTAGRAM STYLE ICON BAR --- */}
          <div className="action-icons">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={handleLike}>
              <TfiHeart className={`icon heart ${liked ? "liked" : ""}`} title="Like" />
              <span style={{ fontWeight: 600, color: "#111827" }}>{likeCount}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={toggleCommentSection}>
              <FaRegComment className="icon comment" title="Comment" />
              <span style={{ fontWeight: 600, color: "#111827" }}>{comments.length}</span>
            </div>

            <BsShare className="icon share" title="Share" />
          </div>

          {/* Comment Input */}
          {showCommentSection && (
            <div className="comment-section" style={{ marginTop: "15px" }}>
              <input
                type="text"
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "20px",
                  border: "1px solid #ccc",
                  marginBottom: "8px",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
                }}
              />
              <button
                onClick={handleAddComment}
                style={{
                  padding: "8px 18px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: 600,
                  transition: "background 0.2s"
                }}
              >
                Submit
              </button>
            </div>
          )}

          {/* Comments List */}
          {showCommentSection && comments.length > 0 && (
            <div className="comments-list" style={{ marginTop: "15px" }}>
              {comments.map((comment, index) => (
                <p key={index} style={{ padding: "6px 12px", borderBottom: "1px solid #eee", borderRadius: "8px", background: "#f8f9fa", marginBottom: "6px" }}>
                  {comment}
                </p>
              ))}
            </div>
          )}

          <div className="back-link-container" style={{ marginTop: "20px" }}>
            <Link to="/dashboard" className="back-btn">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
