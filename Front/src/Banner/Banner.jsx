import React from "react";
import bannerImage from "../images/Banner.jpg";
import "./Banner.css";

const Banner = () => {
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
        <button className="banner-btn">Explore Now</button>
      </div>
      <div className="banner-image">
        <img src={bannerImage} alt="Blog Banner" />
      </div>
    </div>
  );
};

export default Banner; 
