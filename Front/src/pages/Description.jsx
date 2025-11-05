import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* About Section */}
                <div className="footer-section about">
                    <h3>MyBlog</h3>
                    <p>
                        MyBlog is a modern blogging platform for creators, writers, and enthusiasts.
                        Share your stories, insights, and ideas with a global audience easily and securely.
                    </p>
                    <div className="social-icons">
                        <a href="#"><FaFacebookF /></a>
                        <a href="#"><FaTwitter /></a>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaLinkedinIn /></a>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="footer-section contact">
                    <h3>Contact Us</h3>
                    <p><strong>Location:</strong> 123 Main Street, City, Country</p>
                    <p><strong>Phone:</strong> +1 234 567 890</p>
                    <p><strong>Email:</strong> support@myblog.com</p>
                </div>

                {/* Features Section */}
                <div className="footer-section features">
                    <h3>Features</h3>
                    <ul>
                        <li><Link to="/dashboard">Home</Link></li>
                        <li><Link to="/create">Create Post</Link></li>
                        <li><Link to="/dashboard">Blog</Link></li>
                        <li><Link to="/author">Author Profile</Link></li>
                    </ul>
                </div>

                {/* Customer Care Section */}
                <div className="footer-section support">
                    <h3>Customer Care</h3>
                    <ul>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/contact">Support</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms & Conditions</Link></li>
                    </ul>
                </div>

            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                &copy; {new Date().getFullYear()} MyBlog. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
