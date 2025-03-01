import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import logo from "../../assets/image/logo.jpeg";
import { registerUser } from "../../services/api";


export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value.trim(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.username,
        password: formData.password,
        service:"advance"
      });

      console.log("Registration Successful:", response);
      navigate("/");
      alert("Registration Successful!");
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-left">
          <h1 className="title">Fundo</h1>
          <h2 className="subtitle">Create your Fundo Account</h2>

          {error && <p className="error-message">{error}</p>}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="text" name="firstName" placeholder="First Name*" required onChange={handleChange} />
              <input type="text" name="lastName" placeholder="Last Name*" required onChange={handleChange} />
            </div>
            <input type="text" name="username" placeholder="Email*" required onChange={handleChange} />
            <p className="hint">You can use letters, numbers & periods</p>
            <div className="input-group">
              <input type="password" name="password" placeholder="Password*" required onChange={handleChange} />
              <input type="password" name="confirmPassword" placeholder="Confirm*" required onChange={handleChange} />
            </div>
            <p className="hint">Use 8 or more characters with letters, numbers & symbols</p>
            <div className="register-footer">
              <Link to="/" className="signin-link">Sign in instead</Link>
              <button type="submit" className="register-btn">Register</button>
            </div>
          </form>
        </div>

        <div className="register-right">
          <img src={logo} alt="Fundo Banner" className="banner-img" />
          <p className="description">One account. All of Fundo <br /> working for you..</p>
        </div>
      </div>
    </div>
  );
}
