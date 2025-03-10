import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./login.css"; // Ensure this file exists
import { loginUser } from "../../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(email, password);
      localStorage.setItem("fundoo-token", data.id); // Store token
      // alert("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="brand-name">Fundo</h2>
        <h3 className="login-title">Sign in</h3>
        <p className="subtitle">Use your Fundo Account</p>

        {error && <p className="error-message">{error}</p>} {/* Show error message */}

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email or phone*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password*"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="login-footer">
            <div className="left-links">
              <Link to="/forgot-password" className="forgot-password">Forgot password</Link>
              <Link to="/register" className="create-account">Create account</Link>
            </div>
            <button type="submit" className="login-btn">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
