import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./style.css";
import logImg from "../images/log (1).svg";
import registerImg from "../images/register.svg";

const AuthPage = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // ---------------- HANDLE INPUT CHANGE ----------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------- SOCIAL SIGN-IN ----------------
  const handleSocialSignIn = (provider) => {
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  // ---------------- SIGNUP FUNCTION ----------------
  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Signup request submitted! Wait for admin approval.");
        setIsSignUpMode(false);
      } else {
        setMessage(data.message || "❌ Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("❌ Error connecting to server");
    }
  };

  // ---------------- LOGIN FUNCTION ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        login(data);

        // ---------------- SPECIAL REDIRECT ----------------
        if (formData.email === "kadmin@gmail.com" && formData.password === "12345") {
          navigate("/users"); // redirect admin
        } else {
          navigate("/dashboard"); // redirect regular user
        }
      } else {
        setMessage(data.message || "❌ Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("❌ Server error. Try again later.");
    }
  };


  // ---------------- AUTO HIDE MESSAGE ----------------
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // ---------------- MESSAGE COMPONENT ----------------
  const MessageBox = ({ message }) => {
    if (!message) return null;
    const bgColor = message.includes("❌") ? "#ff4d4f" : "#52c41a"; // red for error, green for success

    return (
      <div
        style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: bgColor,
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "5px",
          zIndex: 9999,
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        {message}
      </div>
    );
  };

  return (
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      {/* ------------ FORMS ------------ */}
      <div className="forms-container">
        <div className="signin-signup">
          {/* LOGIN FORM */}
          <form className="sign-in-form" onSubmit={handleLogin}>
            <h2 className="title">Sign in</h2>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <input type="submit" value="Login" className="btn solid" />
            <p className="social-text">Or Sign in with social platforms</p>
            <div className="social-media">
              {["facebook", "twitter", "google", "linkedin"].map((provider) => (
                <button
                  type="button"
                  key={provider}
                  className="social-icon"
                  onClick={() => handleSocialSignIn(provider)}
                  aria-label={`Sign in with ${provider}`}
                >
                  <i className={`fab fa-${provider === "google" ? "google" : provider}-f`}></i>
                  <span className="platform-label">{provider}</span>
                </button>
              ))}
            </div>
          </form>

          {/* SIGNUP FORM */}
          <form className="sign-up-form" onSubmit={handleSignup}>
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <input type="submit" className="btn" value="Sign up" />
            <p className="social-text">Or Sign up with social platforms</p>
            <div className="social-media">
              {["facebook", "twitter", "google", "linkedin"].map((provider) => (
                <button
                  type="button"
                  key={provider}
                  className="social-icon"
                  onClick={() => handleSocialSignIn(provider)}
                  aria-label={`Sign up with ${provider}`}
                >
                  <i className={`fab fa-${provider === "google" ? "google" : provider}-f`}></i>
                  <span className="platform-label">{provider}</span>
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>

      {/* ------------ PANELS ------------ */}
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>Create your account and start sharing your blogs with the world!</p>
            <button className="btn transparent" onClick={() => setIsSignUpMode(true)}>
              Sign up
            </button>
          </div>
          <img src={logImg} className="image" alt="log" />
        </div>

        <div className="panel right-panel">
          <div className="content">
            <h3>Already have an account?</h3>
            <p>Login to continue exploring your blog world!</p>
            <button className="btn transparent" onClick={() => setIsSignUpMode(false)}>
              Sign in
            </button>
          </div>
          <img src={registerImg} className="image" alt="register" />
        </div>
      </div>

      {/* ------------ MESSAGE BOX ------------ */}
      <MessageBox message={message} />
    </div>
  );
};

export default AuthPage;
