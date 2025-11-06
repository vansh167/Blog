import React, { useContext, useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = useCallback(() => {
    logout(); // Actually logs the user out
    navigate("/auth"); // Redirects to login/auth page
  }, [logout, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="navbar navbar-elevated">
      <div className="navbar-left">
        <Link to="/dashboard" className="brand">

          <div>
            <span className="brand-name">
              <span className="brand-badge">M</span>
              yB<span className="brand-badge1">l</span>og</span></div>
        </Link>

        <div className="nav-items">
          <Link to="/dashboard" className="nav-link">Home</Link>
          <Link to="/create" className="nav-link">Create</Link>
          <Link to="/category" className="nav-link">Category</Link>
          <Link to="/dashboard" className="nav-link">Blog</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact Us</Link>
          {/* Logout button */}

        </div>
      </div>

      <div className="navbar-center">
        {/* Search bar */}
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

      <div className="navbar-right">
        <Link to="/author" className="btn btn-pill btn-ghost">Author</Link>

        {user ? (
          <Link to="/auth" className="btn btn-pill btn-primary">Logout</Link>
        ) : (
          <button className="btn btn-pill btn-primary" onClick={handleLogout}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
