import React from "react";
import { NavLink } from "react-router-dom";
// import "./Dashboard.css";
import Keep1 from "../../assets/image/Keep1.png";
import Keep2 from "../../assets/image/Keep2.png";
import Keep3 from "../../assets/image/Keep3.png";
import Keep4 from "../../assets/image/Keep4.png";
import Keep5 from "../../assets/image/Keep5.png";
import "../DashboardContainer/DashboardContainer.scss";

function Sidebar({ isCollapsed }) {
  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-items">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
        >
          <img src={Keep5} alt="p" className="P" /> {!isCollapsed && "Notes"}
        </NavLink>
        <NavLink
          to="/reminders"
          className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
        >
          <img src={Keep1} alt="p" className="P" /> {!isCollapsed && "Reminders"}
        </NavLink>
        <NavLink
          to="/edit-labels"
          className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
        >
          <img src={Keep2} alt="p" className="P" /> {!isCollapsed && "Edit Labels"}
        </NavLink>
        <NavLink
          to="/dashboard/archive"
          className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
        >
          <img src={Keep3} alt="p" className="P" /> {!isCollapsed && "Archive"}
        </NavLink>
        <NavLink
          to="/dashboard/trash"
          className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""}`}
        >
          <img src={Keep4} alt="p" className="P" /> {!isCollapsed && "Trash"}
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;