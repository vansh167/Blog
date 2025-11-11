import React from "react";
import { useNavigate } from "react-router-dom";
import bannerImage from "../images/Banner.jpg";
import "./Banner.css";

const Banner = () => {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/category"); // navigate to /category
  };

  return (
    <div className="banner-container">
      <div className="banner-text">
        <h1>
          Something <span className="highlight">Amazing</span> <br />
          for Your Blog!
        </h1>
        <p>
          Discover inspiring stories, creative ideas, <br />
          and insightful articles that spark curiosity <br />
          and creativity every day.
        </p>
        <button className="banner-btn" onClick={handleExplore}>
          Explore Now
        </button>
      </div>
      <div className="banner-image">
        <img src={bannerImage} alt="Blog Banner" />
      </div>
    </div>
  );
};

export default Banner;
