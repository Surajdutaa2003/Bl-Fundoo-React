import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../DashboardContainer/Sidebar";
import "../DashboardContainer/DashboardContainer.scss";
import keepLogo from "../../assets/image/KeepLogo.png";
import Header from "../DashboardContainer/Header"; // Assuming Header is in the same folder

function Dashboard() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "user@example.com";
    setUserEmail(email);
  }, []);

  const handleProfileClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("fundoo-token");
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="dashboard">
      <Header
        toggleSidebar={toggleSidebar}
        userEmail={userEmail}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="dashboard-container">
        <Sidebar isCollapsed={isSidebarCollapsed} />
        <Outlet context={{ searchQuery }} />
      </div>
    </div>
  );
}

export default Dashboard;