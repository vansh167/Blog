import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./style.css";
import logImg from "../images/log (1).svg";
import registerImg from '../images/register.svg';

const AuthPage = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const { login } = useContext(AuthContext); // ✅ useContext now works
  const navigate = useNavigate();
  // ---------------- HANDLE INPUT CHANGE ----------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------- SOCIAL SIGN-IN ----------------
  // Opens backend OAuth endpoints. Adjust provider routes if your backend differs.
  const handleSocialSignIn = (provider) => {
    // open in same tab to let backend redirect back to app (or use popup and postMessage flow)
    window.location.href = `http://localhost:5000/api/auth/${provider}`;
  };

  // ---------------- SIGNUP FUNCTION ----------------
  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
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
        setMessage("✅ Signup successful! Please login now.");
        setIsSignUpMode(false);
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup fetch error:", error);
      setMessage("❌ Error connecting to server");
    }
  };
  // ...existing code...
  // ---------------- LOGIN FUNCTION ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        // backend returns the user object as the response body (with _id, name, email, token)
        // pass the whole data object to login so AuthContext and localStorage.user are populated
        login(data);
        setMessage("✅ Login successful!");
        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setMessage(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login fetch error:", error);
      setMessage("❌ Error connecting to server");
    }
  };

  // ---------------- UI ----------------//
  return (
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* ------------ LOGIN FORM ------------ */}
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
              <button type="button" className="social-icon" onClick={() => handleSocialSignIn('facebook')} aria-label="Sign in with Facebook" title="Facebook">
                <i className="fab fa-facebook-f"></i>
                <span className="platform-label">Facebook</span>
              </button>
              <button type="button" className="social-icon" onClick={() => handleSocialSignIn('twitter')} aria-label="Sign in with Twitter" title="Twitter">
                <i className="fab fa-twitter"></i>
                <span className="platform-label">Twitter</span>
              </button>
              <button type="button" className="social-icon" onClick={() => handleSocialSignIn('google')} aria-label="Sign in with Google" title="Google">
                <i className="fab fa-google"></i>
                <span className="platform-label">Google</span>
              </button>
              <button type="button" className="social-icon" onClick={() => handleSocialSignIn('linkedin')} aria-label="Sign in with LinkedIn" title="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
                <span className="platform-label">LinkedIn</span>
              </button>
            </div>
          </form>

          {/* ------------ SIGNUP FORM ------------ */}
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
              <button type="button" className="social-icon" onClick={() => handleSocialSignIn('facebook')} aria-label="Sign up with Facebook" title="Facebook">
                <i className="fab fa-facebook-f"></i>
                <span className="platform-label">Facebook</span>
              </button>
              <button type="button" className="social-icon" onClick={() => handleSocialSignIn('twitter')} aria-label="Sign up with Twitter" title="Twitter">
                <i className="fab fa-twitter"></i>
                <span className="platform-label">Twitter</span>
              </button>
              <button type="button" className="social-icon" onClick={() => handleSocialSignIn('google')} aria-label="Sign up with Google" title="Google">
                <i className="fab fa-google"></i>
                <span className="platform-label">Google</span>
              </button>
              <button type="button" className="social-icon" onClick={() => handleSocialSignIn('linkedin')} aria-label="Sign up with LinkedIn" title="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
                <span className="platform-label">LinkedIn</span>
              </button>
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
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AuthPage;