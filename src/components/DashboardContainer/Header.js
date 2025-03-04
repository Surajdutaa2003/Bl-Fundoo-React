import React from "react";
// import "./Dashboard.css";
import Keep from "../../assets/image/KeepLogo.png";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "../DashboardContainer/DashboardContainer.scss";

function Header({ toggleSidebar, userEmail, searchQuery, setSearchQuery }) {
  const profileInitial = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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

      <div className="profile-icon">{profileInitial}</div>
    </div>
  );
}

export default Header;