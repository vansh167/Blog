import React from "react";
import { Link } from "react-router-dom";
import "./PostCard.css";

const PostCard = ({ id, title, author, image, description }) => {
  return (
    <Link to={`/post/${id}`} className="post-link">
      <div className="post-card">
        <img src={image} alt={title} />
        <div className="post-content">
          <h2>{title}</h2>
          <p className="author">by {author}</p>
          <p className="desc">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
