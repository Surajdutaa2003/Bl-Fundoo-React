import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Dashboard.css";

function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Add search state

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
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
        <Outlet context={{ searchQuery }} /> {/* Pass searchQuery to child routes */}
      </div>
    </div>
  );
}

export default Dashboard;