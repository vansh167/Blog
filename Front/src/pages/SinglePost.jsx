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
            <span className="author">By {post.author}</span>
            <span className="date">{post.date}</span>
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
            {post.content.split("\n").map((para, index) => (
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
