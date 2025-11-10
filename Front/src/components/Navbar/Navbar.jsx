import React, { useContext, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = useCallback(() => {
    logout();
    navigate("/auth");
  }, [logout, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  // Check if user is SubAdmin
  const isSubAdmin = user?.email === "kadmin@gmail.com";

  const handleSubAdminClick = () => {
    if (isSubAdmin) {
      navigate("/users");
    } else {
      navigate("/author");
    }
  };

  return (
    <nav className="navbar navbar-elevated">
      {/* Left Section */}
      <div className="navbar-left">
        <Link to="/dashboard" className="brand">
          <div className="brand-name">
            <span className="brand-badge">M</span>
            yB<span className="brand-badge1">l</span>og
          </div>
        </Link>

        <div className="nav-items">
          <Link to="/dashboard" className="nav-link">Blog</Link>
          <Link to="/create" className="nav-link">Write</Link>
          <Link to="/category" className="nav-link">Category</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact Us</Link>
          {isSubAdmin && <Link to="/users" className="nav-link">Sub</Link>}
        </div>
      </div>

      {/* Center Section */}
      <div className="navbar-center">
        <form className="nav-search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        <button
          className="btn btn-pill btn-ghost"
          onClick={handleSubAdminClick}
        >
          {isSubAdmin ? "SubAdmin" : "Profile"}
        </button>

        {user ? (
          <button className="btn btn-pill btn-primary" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/auth" className="btn btn-pill btn-primary">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
