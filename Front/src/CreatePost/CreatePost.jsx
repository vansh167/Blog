import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./CreatePost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [relatedTags, setRelatedTags] = useState([]);

  const textareaRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const editId = params.get("id");

  const { user, logout } = useContext(AuthContext);

  // Predefined hashtags
  const allHashtags = [
    "funny",
    "adventure",
    "Technology",
    "business",
    "Education",
    "science",
    "lifestyle",
  ];

  // Map of related tags
  const relatedMap = {
    funny: ["humor", "jokes", "memes", "fun", "comedy"],
    adventure: ["travel", "explore", "hiking", "journey", "nature"],
    Technology: ["AI", "Gadgets", "Innovation", "Software", "Hardware"],
    business: ["finance", "startup", "marketing", "economy", "entrepreneur"],
    Education: ["learning", "students", "teaching", "school", "knowledge"],
    science: ["research", "space", "physics", "biology", "chemistry"],
    lifestyle: ["health", "fashion", "fitness", "wellness", "daily"],
  };

  // Redirect unauthenticated users
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  // Load post if editing
  useEffect(() => {
    if (!editId) return;
    const loadPost = async () => {
      try {
        const API =
          import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";
        const res = await fetch(`${API}/api/posts/${editId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch post");
        setTitle(data.title || "");
        setContent(data.content || "");
        setImage(data.image || "");
      } catch (err) {
        console.error("Load post failed", err);
        setMessage(err.message || "Failed to load post");
      }
    };
    loadPost();
  }, [editId]);

  // Insert hashtag at cursor position
  // Insert main hashtag and automatically add related tags
  const insertHashtag = (tag) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Get related tags
    const related = relatedMap[tag] || [];
    // Combine main tag + related tags, all prefixed with #
    const hashtags = [tag, ...related].map((t) => `#${t}`).join(" ");

    const newText =
      content.substring(0, start) + hashtags + " " + content.substring(end);
    setContent(newText);

    // Move cursor to end of inserted hashtags
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + hashtags.length + 1;
      textarea.focus();
    }, 0);
  };


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
      const API =
        import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";
      let res;
      if (editId) {
        res = await fetch(`${API}/api/posts/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content, image }),
        });
      } else {
        res = await fetch(`${API}/api/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content, image }),
        });
      }

      const data = await res.json();
      if (res.status === 401) {
        setMessage("Session expired. Please login again.");
        logout();
        navigate("/auth", { replace: true });
        return;
      }

      if (!res.ok) throw new Error(data.message || "Failed to create post");
      setMessage("Post created successfully!");
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.message || "Unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="create-page">
      <div className="create-container">
        <h1>{editId ? "Edit Post" : "Create New Post"}</h1>
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
            ref={textareaRef}
            rows="6"
            placeholder="Write your post content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() =>
              setTimeout(() => setShowSuggestions(false), 200)
            } // delay to allow click
            required
          />

          {/* Initial Hashtag Suggestions */}
          {showSuggestions && (
            <div className="hashtag-suggestions">
              {allHashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="suggestion"
                  onClick={() => insertHashtag(tag)}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Related Hashtag Suggestions */}
          {relatedTags.length > 0 && (
            <div className="related-suggestions">
              <p>Related tags:</p>
              {relatedTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="suggestion"
                  onClick={() => insertHashtag(tag)}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <button type="submit" className="create-btn" disabled={submitting}>
            {submitting ? "Publishing..." : editId ? "Update" : "Publish"}
          </button>

          {message && <p className="message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
