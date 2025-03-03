import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../DashboardContainer/Sidebar";
// import { IconButton } from "@mui/material";
// import AttachFileIcon from "@mui/icons-material/AttachFile"; // For paperclip icon
import "../DashboardContainer/Dashboard.css";
// Import logo if in src/assets
import keepLogo from "../../assets/image/KeepLogo.png";

function Dashboard() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  useEffect(() => {
    // Fetch user email from localStorage on mount
    const email = localStorage.getItem("userEmail") || "user@example.com"; // Default email if none
    setUserEmail(email);
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("userEmail");
    localStorage.removeItem("fundoo-token"); // Assuming this is your auth token key
    // Redirect to login page (root path "/")
    navigate("/");
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Get value from input
  };

  // Get the first letter of the email for the profile icon
  const getProfileInitial = () => {
    return userEmail.charAt(0).toUpperCase() || "U"; // Default to "U" if no email
  };

  // Get the username (only alphabets before first dot or special char, first letter capitalized)
  const getUsername = () => {
    if (!userEmail) return "User";
    const usernamePart = userEmail.split(/[\.@!]/)[0]; // Get all characters before first dot (.) or special char (@, !)
    const alphabets = usernamePart.replace(/[^a-zA-Z]/g, ""); // Keep only alphabets, remove numbers and special chars
    return alphabets ? alphabets.charAt(0).toUpperCase() + alphabets.slice(1).toLowerCase() : "User"; // Capitalize first letter, rest lowercase**
  };

  return (
    <div className="dashboard">
      <div className="header">
        <div className="logo-container">
          <img src={keepLogo} alt="Keep Logo" className="keep-logo" />
          <h1 className="h1">Keep</h1>
        </div>
        <input
          className="search-bar"
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="profile-icon-container" onClick={handleProfileClick}>
          <div className="profile-icon">
            {getProfileInitial()}
          </div>
        </div>
        {isDropdownOpen && (
          <div className="profile-dropdown">
            <div className="dropdown-header">
              <p>{userEmail}</p> {/* Full email at the top */}
              <div className="dropdown-avatar-container">
                <div className="profile-avatar">{getProfileInitial()}</div>
              </div>
              <span>Hi, {getUsername()}!</span>
            </div>
            <button className="dropdown-button" onClick={() => {/* Add manage account logic if needed */}}>
              Manage your Google Account
            </button>
            <div className="dropdown-more">
              <button className="dropdown-link" onClick={() => {/* Add hide accounts logic if needed */}}>
                Hide more accounts <span>▲</span>
              </button>
              <div className="additional-account">
                <div className="additional-details">
                  {/* Additional account details can be added dynamically if needed */}
                </div>
              </div>
              <button className="dropdown-button">+ Add another account</button>
              <button className="dropdown-button logout-button" onClick={handleLogout}>
                Sign out <span>↱</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="dashboard-container">
        <Sidebar />
        <Outlet context={{ searchQuery }} /> {/* Pass searchQuery as context */}
      </div>
    </div>
  );
}

export default Dashboard;