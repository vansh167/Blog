import React, { useState } from "react";
import { User, Mail, FileText, Settings } from "lucide-react";
import './SideBar.css'
const Sidebar = () => {
  const [active, setActive] = useState("user");

  const menuItems = [
    { id: "user", label: "User", icon: <User size={22} /> },
    { id: "request", label: "Request", icon: <Mail size={22} /> },
    { id: "posts", label: "Posts", icon: <FileText size={22} /> },
    { id: "settings", label: "Settings", icon: <Settings size={22} /> },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="logo">🚀</div>

      {/* Menu */}
      <nav className="menu">
        {menuItems.map((item) => (
          <div key={item.id} className="menu-item">
            <button
              onClick={() => setActive(item.id)}
              className={`icon-btn ${
                active === item.id ? "active" : "inactive"
              }`}
            >
              {item.icon}
            </button>

            <span className="tooltip">{item.label}</span>
          </div>
        ))}
      </nav>

      
    </aside>
  );
};

export default Sidebar;
