import React from 'react';
import './Contact.css';

// ====================== Contact Info Item ======================
const ContactInfoItem = ({ iconClass, title, content, subContent }) => (
    <div className="info-item">
        <i className={`icon ${iconClass}`}></i>
        <div>
            <p className="info-title">{title}</p>
            <p className="info-content">{content}</p>
            {subContent && <p className="info-sub-content">{subContent}</p>}
        </div>
    </div>
);

// ====================== Social Link ======================
const SocialLink = ({ iconClass, platform, handle }) => (
    <a href="#" className="social-link">
        <i className={`icon ${iconClass}`}></i>
        <div>
            <p className="platform-name">{platform}</p>
            <p className="platform-handle">{handle}</p>
        </div>
    </a>
);

// ====================== Contact Page ======================
const ContactPage = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Message Sent (In a real app, this would submit to a backend)');
    };

    return (
        <div className="contact-page-container">
            {/* ====================== LEFT: Contact Form ====================== */}
            <div className="contact-form-section">
                <h2>Send us a message</h2>
                <form onSubmit={handleSubmit}>
                    {/* Name Fields */}
                    <div className="name-fields">
                        <div className="form-group">
                            <input type="text" id="firstName" placeholder=" " required />
                            <label htmlFor="firstName">First Name</label>
                        </div>
                        <div className="form-group">
                            <input type="text" id="lastName" placeholder=" " required />
                            <label htmlFor="lastName">Last Name</label>
                        </div>
                    </div>
                    <div className="name-fields">
                    {/* Email */}
                    <div className="form-group1">
                            <input type="email" id="email" placeholder="Email" style={{width:'230px'}} required />
                        
                        </div>

                             
                            <div className="form-group1">
                            <select id="subject" defaultValue="" style={{ width: '230px' }}>
                            <option value="" disabled hidden></option>
                            <option value="support">Support</option>
                            <option value="sales">Sales Inquiry</option>
                            <option value="general">General Feedback</option>
                        </select>
                        <label htmlFor="subject">Subject</label>
                    </div>
                    </div>
                    {/* Message */}
                    <div className="form-group" >
                        <textarea id="message" style={{ width: '480px' }} placeholder=" " rows="5" ></textarea>
                        <label htmlFor="message">Message</label>
                    </div>

                    {/* Checkbox + Button */}
                    <div className="form-bottom-row">
                        <div className="checkbox-group">
                            <input type="checkbox" id="newsletter" />
                            <label htmlFor="newsletter">
                                I'd like to receive updates and newsletters from BlogSpace
                            </label>
                        </div>
                        <button type="submit" className="send-button">
                            Send Message <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </form>
            </div>

            {/* ====================== RIGHT: Sidebar ====================== */}
            <aside className="contact-info-sidebar">
                {/* Contact Info */}
                <div className="contact-information-block">
                    <h3>Contact Information</h3>
                    <ContactInfoItem
                        iconClass="fas fa-envelope"
                        title="Email"
                        content="hello@blogspace.com"
                        subContent="support@blogspace.com"
                    />
                    <ContactInfoItem
                        iconClass="fas fa-phone"
                        title="Phone"
                        content="+1 (555) 123-4567"
                        subContent="Mon-Fri: 9AM-5PM EST"
                    />
                    <ContactInfoItem
                        iconClass="fas fa-map-marker-alt"
                        title="Address"
                        content="123 Blog Street, Content City, CC 12345"
                        subContent="United States"
                    />
                </div>

                {/* Social Links */}
                <div className="follow-us-block">
                    <h3>Follow Us</h3>
                    <SocialLink iconClass="fab fa-twitter" platform="Twitter" handle="@blogspace" />
                    <SocialLink iconClass="fab fa-facebook-f" platform="Facebook" handle="BlogSpace Official" />
                    <SocialLink iconClass="fab fa-instagram" platform="Instagram" handle="@blogspace_official" />
                    <SocialLink iconClass="fab fa-linkedin-in" platform="LinkedIn" handle="BlogSpace Company" />
                </div>
            </aside>
        </div>
    );
};

export default ContactPage;
