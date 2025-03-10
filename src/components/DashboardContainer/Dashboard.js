import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../DashboardContainer/Sidebar";
import "../DashboardContainer/DashboardContainer.scss";
import keepLogo from "../../assets/image/KeepLogo.png";
import Header from "../DashboardContainer/Header";

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [notesList, setNotesList] = useState([]);
  const [trashedNotes, setTrashedNotes] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const [activeSection, setActiveSection] = useState("notes"); // Track active section

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "user@example.com";
    setUserEmail(email);

    // Determine active section based on location pathname
    const path = location.pathname;
    if (path === "/dashboard") setActiveSection("notes");
    else if (path === "/dashboard/archive") setActiveSection("archive");
    else if (path === "/dashboard/trash") setActiveSection("trash");
    else if (path === "/dashboard/reminders") setActiveSection("reminders");
  }, [location]);

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

  const refreshSection = () => {
    // Placeholder for refresh function to be passed via context
    if (typeof refreshFunctions[activeSection] === "function") {
      refreshFunctions[activeSection]();
    }
  };

  // Object to map active section to refresh function (to be populated by Outlet context)
  const refreshFunctions = {};

  return (
    <div className="dashboard">
      <Header
        toggleSidebar={toggleSidebar}
        userEmail={userEmail}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isGridView={isGridView}
        setIsGridView={setIsGridView}
        refreshSection={refreshSection} // Pass refresh function
      />
      <div className="dashboard-container">
        <Sidebar isCollapsed={isSidebarCollapsed} />
        <Outlet
          context={{
            searchQuery,
            setNotesList,
            setTrashedNotes,
            isGridView,
            activeSection,
            setRefreshFunction: (section, fn) => { refreshFunctions[section] = fn; }, // Allow components to register their refresh function
          }}
        />
      </div>
    </div>
  );
}

export default Dashboard;