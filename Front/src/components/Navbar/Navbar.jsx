import React from 'react'
import './Navbar.css'
const Navbar = () => {
  return (
         <nav className="navbar">
      <div className="navbar-logo">MyBlog</div>
      <div className="navbar-links">
        <a href="/dashboard">Home</a>
        <a href="/create">Create</a>
        <a href="/">Login</a>
      </div>
    </nav>
    
  )
}

export default Navbar