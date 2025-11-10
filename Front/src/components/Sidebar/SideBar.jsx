import React, { useState, useEffect } from "react";
import { User, Mail, FileText, Settings } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import './SideBar.css'

const Sidebar = () => {
  const [active, setActive] = useState("user");
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "user", label: "User", icon: <User size={22} />, route: '/users' },
    { id: "request", label: "Request", icon: <Mail size={22} />, route: '/request' },
    { id: "posts", label: "Posts", icon: <FileText size={22} />, route: '/author/posts' },
    { id: "settings", label: "Settings", icon: <Settings size={22} />, route: '/author/settings' },
  ];

  const handleClick = (item) => {
    setActive(item.id);
    if (item.route) navigate(item.route);
  };

  // Keep active state in sync with the current path (useful on reload / direct nav)
  useEffect(() => {
  const path = location.pathname || '';
  if (path.startsWith('/users')) setActive('user');
  else if (path.startsWith('/author/requests')) setActive('request');
  else if (path.startsWith('/author/posts')) setActive('posts');
  else if (path.startsWith('/author/settings')) setActive('settings');
    // otherwise keep default
  }, [location.pathname]);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="logo">🚀</div>

      {/* Menu */}
      <nav className="menu">
        {menuItems.map((item) => (
          <div key={item.id} className={`menu-item ${active === item.id ? 'active' : ''}`}>
            <button
              onClick={() => handleClick(item)}
              className={`icon-btn ${active === item.id ? "active" : "inactive"}`}
              aria-label={item.label}
            >
              {item.icon}
            </button>

            <span className="tooltip">{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="footer">v1.0</div>
    </aside>
  );
};

export default Sidebar;
