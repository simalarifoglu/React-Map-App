import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { updateUser } from "../../redux/state/authState";
import "../Admin/AdminMainPanel.css";
import ConfirmationModal from "../Admin/ConfirmationModal";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/state/authState";
import UserLogsPanel from "./UserLogsPanel";

const AccountSettingsPanel = ({ isOpen, onClose }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState("account");
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const navigate = useNavigate();


    if (!isOpen) return null;

    const handleUpdateAccount = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                "https://localhost:7176/api/Auth/account/update",
                {
                    username,
                    email,
                    currentPassword,
                    newPassword,
                },
                { withCredentials: true }
            );

            dispatch(updateUser({ username, email }));
            toast.success(response?.data?.message ?? "Account updated successfully");

            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            toast.error(err?.response?.data?.message ?? "Update failed");
        }
    };

    const handleDeleteConfirmed = async () => {
        try {
            const res = await axios.delete("https://localhost:7176/api/Auth/account/delete", {
                withCredentials: true,
            });
            toast.success(res?.data?.message ?? "Account deleted successfully");
            window.location.href = "/login";
        } catch (err) {
            toast.error(err?.response?.data?.message ?? "Delete failed");
        }
    };

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


    return (
        <div className={`admin-panel-overlay ${isOpen ? "panel-open" : ""}`}>
            <div className={`admin-dashboard-container ${isOpen ? "panel-open" : ""}`}>

                <div className="admin-sidebar">
                    <h3>Welcome, {user?.username}</h3>

                    <button
                        className={activeTab === "account" ? "active" : ""}
                        onClick={() => setActiveTab("account")}
                    >
                        Account Settings
                    </button>

                    <button
                        className={activeTab === "logs" ? "active" : ""}
                        onClick={() => setActiveTab("logs")}
                    >
                        My Activity
                    </button>

                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>

                <div className="admin-content">
                    <div className="admin-panel-header">
                        <button className="admin-close-btn" onClick={onClose}>×</button>
                    </div>

                    {activeTab === "account" && (
                        <form onSubmit={handleUpdateAccount} className="admin-settings">
                            <h2>Account Settings</h2>

                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Current Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />
                                    <button type="button" onClick={() => setShowCurrentPassword(prev => !prev)}>
                                        {showCurrentPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>New Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button type="button" onClick={() => setShowNewPassword(prev => !prev)}>
                                        {showNewPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <div className="action-buttons">
                                <button className="save-btn" type="submit">Update Account</button>
                                <button type="button" className="delete-btn" onClick={() => setShowConfirmModal(true)}>
                                    Delete Account
                                </button>
                            </div>
                        </form>
                    )}
                    {activeTab === "logs" && (
                        <UserLogsPanel onClose={onClose} />
                    )}
                </div>
            </div>

            {showConfirmModal && (
                <ConfirmationModal
                    message="Are you sure you want to delete your account? This action cannot be undone."
                    onConfirm={handleDeleteConfirmed}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}
        </div>
    );
};

export default AccountSettingsPanel;
