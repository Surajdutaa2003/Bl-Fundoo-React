import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Keep from "../../assets/image/KeepLogo.png";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import GridViewIcon from "@mui/icons-material/GridView"; // Added for grid view
import Tooltip from "@mui/material/Tooltip";
import "../DashboardContainer/DashboardContainer.scss";
import ViewStreamOutlinedIcon from '@mui/icons-material/ViewStreamOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import AppsIcon from '@mui/icons-material/Apps';

function Header({ toggleSidebar, userEmail, searchQuery, setSearchQuery, isGridView, setIsGridView }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const profileInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  // Function to format username from email
  const formatUsername = (email) => {
    if (!email) return "User";
    const match = email.match(/^[a-zA-Z]+/); // Extracts only the first alphabetic part
    if (match) {
      let name = match[0].toLowerCase(); // Convert everything to lowercase
      return name.charAt(0).toUpperCase() + name.slice(1); // Capitalize first letter
    }
    return "User";
  };

  const username = formatUsername(userEmail);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("fundoo-token");
    navigate("/");
  };

  const toggleView = () => {
    setIsGridView(!isGridView); // Toggle isGridView when icon is clicked
  };

  return (
    <div className="header">
      <IconButton onClick={toggleSidebar} className="menu-button">
        <MenuIcon />
      </IconButton>
      <div className="logo-container">
        <img src={Keep} alt="Keep Logo" className="keep-logo" />
        <h1 className="h1">Keep</h1>
      </div>
      <input
        type="text"
        placeholder="Search"
        className="search-bar"
        value={searchQuery}
        onChange={handleSearchChange}
      />

<Tooltip title="Refresh" arrow>
        <IconButton size="medium" className="refresh-button" onClick={() => window.location.reload()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={isGridView ?  "Switch to Grid View":"Switch to List View" } placement="top" arrow>
        <IconButton size="medium" className="drag-handle-button" onClick={toggleView}>
          {isGridView ?   <ViewStreamOutlinedIcon  fontSize="medium" />:<GridViewIcon fontSize="medium" /> }
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Settings" arrow>
        <IconButton size="medium" className="settings-button" onClick={() => navigate("/settings")}>
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Apps" arrow>
        <IconButton size="medium" className="apps-button" onClick={() => navigate("/apps")}>
          <AppsIcon />
        </IconButton>
      </Tooltip>

      <div className="profile-container">
        <div className="profile-icon" onClick={toggleDropdown}>
          {profileInitial}
        </div>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <div className="profile-section">
              <div className="profile-circle">{profileInitial}</div>
              <p className="user-email">{userEmail}</p>
              <h3 className="greeting">Hi, {username}</h3>
              <button className="manage-account">Manage your account</button>
            </div>
            <hr />
            <button className="sign-out" onClick={handleLogout}>Sign out</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;