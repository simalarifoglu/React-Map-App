import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { updateUser } from "../../redux/state/authState";
import "./AdminMainPanel.css";
import ConfirmationModal from "./ConfirmationModal";

const AdminSettings = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleUpdate = async () => {
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


  return (
    <div className="admin-settings">
      <h2>Account Settings</h2>

      <div className="form-group">
        <label>Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
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
        <button className="save-btn" onClick={handleUpdate}>Update Account</button>
        <button className="delete-btn" onClick={() => setShowConfirmModal(true)}>Delete Account</button>
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

export default AdminSettings;
