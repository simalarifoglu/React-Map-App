import { useState } from "react";
import "./AdminMainPanel.css";
import UserPanel from "./UserPanel";
import AnalyticsPanel from "./AnalyticsPanel";

const AdminMainPanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("analytics");

  if (!isOpen) return null;

  return (
    <div className={`admin-overlay ${isOpen ? 'panel-open' : ''}`}>
      <div className="admin-main-panel">
      <button className="admin-close-btn" onClick={onClose}>×</button>

        <div className="admin-sidebar">
          <h3>Admin Panel</h3>
          <div className="nav-section">
            <button
              className={activeTab === "analytics" ? "active" : ""}
              onClick={() => setActiveTab("analytics")}
            >
              Analytics
            </button>
            <button
              className={activeTab === "users" ? "active" : ""}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>
            <button disabled>Settings</button>
          </div>
          <button className="logout-button" onClick={onClose}>Logout</button>
        </div>

        <div className="admin-main-content">
          <div className="admin-header">
            <h2>
              {activeTab === "users" ? "Registered Users" : "Yöneticiler İçin Analytics"}
            </h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          {activeTab === "users" && <UserPanel />}
          {activeTab === "analytics" && <AnalyticsPanel />}
        </div>
      </div>
    </div>
  );
};

export default AdminMainPanel;
