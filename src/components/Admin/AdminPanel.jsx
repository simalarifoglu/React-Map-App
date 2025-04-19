import { useState } from "react";
import "./AdminMainPanel.css";
import { logout } from "../../redux/state/authState";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserPanel from "./UserPanel";
import AnalyticsPanel from "./AnalyticsPanel";
import AdminSettings from "./AdminSettings";
import LogsPanel from "./LogsPanel";

const AdminPanel = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("analytics");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("https://localhost:7176/api/Auth/logout", {
        method: "POST",
        credentials: "include",
      });

      dispatch(logout());
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderContent = () => {
    switch (activeTab.toLowerCase()) {
      case "settings": return <AdminSettings />;
      case "analytics": return <AnalyticsPanel />;
      case "users": return <UserPanel onCloseAdminPanel={onClose} />;
      case "logs": return <LogsPanel />;
      default: return null;
    }
  };

  return (
    <div className={`admin-panel-overlay ${isOpen ? "panel-open" : ""}`}>
      <div className={`admin-dashboard-container ${isOpen ? "panel-open" : ""}`}>
        <div className="admin-sidebar">
          <h3>Admin Panel</h3>
          <button className={activeTab === "analytics" ? "active" : ""} onClick={() => setActiveTab("analytics")}>Analytics</button>
          <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>Users</button>
          <button className={activeTab === "settings" ? "active" : ""} onClick={() => setActiveTab("settings")}>Settings</button>
          <button className={activeTab === "logs" ? "active" : ""} onClick={() => setActiveTab("logs")}>Logs</button> {/* ✅ LOGS butonu */}
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        <div className="admin-content">
          <div className="admin-panel-header">
            <button className="admin-close-btn" onClick={onClose}>×</button>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
