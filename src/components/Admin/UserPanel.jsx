import { useEffect, useState } from "react";
import "./AdminMainPanel.css";
import ConfirmPanel from "../ConfirmPanel/ConfirmPanel";
import { toast } from "react-toastify";
import React from "react";
import zoomToFeature from "../../utils/ZoomPoint";
import { getMap, vectorSource } from "../../utils/MapView";

const UserPanel = ({ onCloseAdminPanel }) => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedGeometryType, setSelectedGeometryType] = useState("POINT");


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`https://localhost:7176/api/Auth/users?page=${currentPage}&limit=${perPage}`, {
          credentials: "include",
        });
        const data = await res.json();
        setUsers(data.value || []);
        setTotalUsers(data.totalCount || 0);
      } catch (err) {
        console.error("Kullanıcılar alınamadı:", err);
      }
    };

    fetchUsers();
  }, [currentPage]);

  const handleDeleteUser = (id) => {
    setSelectedUserId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async (confirm) => {
    if (confirm && selectedUserId) {
      try {
        const res = await fetch(`https://localhost:7176/api/Auth/delete-user/${selectedUserId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (res.ok) {
          setUsers((prev) => prev.filter((u) => u.id !== selectedUserId));
          toast.success("User deleted successfully!");
        } else {
          toast.error("Failed to delete user.");
        }
      } catch {
        toast.error("Error deleting user.");
      }
    }
    setSelectedUserId(null);
    setIsConfirmOpen(false);
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await fetch(`https://localhost:7176/api/Auth/user-objects-summary/${userId}`, {
        credentials: "include"
      });
      const data = await response.json();
      console.log("selectedDetails:", data);

      const user = users.find(u => u.id === userId);
      setSelectedUsername(user?.username || "");
      setSelectedDetails(data);
      setIsDetailsPanelOpen(true);
    } catch (err) {
      console.error("Detaylar alınamadı:", err);
    }
  };

  const handleObjectFocus = (userId, type, createdAt) => {
    const map = getMap();
    if (!map) return;

    const targetFeature = vectorSource.getFeatures().find(f => {
      const pointData = f.get("pointData");
      return (
        pointData?.createdAt &&
        new Date(pointData.createdAt).toISOString() === new Date(createdAt).toISOString()
      );
    });

    if (targetFeature) {
      const pointData = targetFeature.get("pointData");
      zoomToFeature(map, pointData);
      setIsDetailsPanelOpen(false);
      onCloseAdminPanel?.();
    } else {
      console.warn("Feature not found on map.");
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    const date = new Date(iso);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleSection = (section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const shortenWkt = (wkt, maxLen = 100) => {
    if (!wkt) return "-";
    return wkt.length > maxLen ? `${wkt.slice(0, maxLen)}...` : wkt;
  };

  const getWktType = (wkt) => {
    if (!wkt) return "-";
    const type = wkt.trim().split("(")[0].toUpperCase();
    return type;
  };

  const groupedFeatures = {
    POINT: [],
    LINESTRING: [],
    POLYGON: []
  };

  vectorSource.getFeatures().forEach(f => {
    const pd = f.get("pointData");
    if (pd?.wkt) {
      const type = getWktType(pd.wkt);
      if (groupedFeatures[type]) {
        groupedFeatures[type].push(pd);
      }
    }
  });

  const totalPages = Math.ceil(totalUsers / perPage);

  return (
    <>
      <div className="admin-header">
        <h2 className="admin-title">Registered Users</h2>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="view-btn" onClick={() => fetchUserDetails(user.id)}>View Details</button>
                  <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="empty-cell" style={{ textAlign: "center", padding: "20px", color: "#b8503b" }}>
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {isDetailsPanelOpen && (
        <div className="overlay-modal">
          <div className="details-modal-centered">
            <div className="details-header">
              <h3>User Object Details ({selectedUsername})</h3>
              <button onClick={() => setIsDetailsPanelOpen(false)} className="close-btn">X</button>
            </div>

            <div className="type-selector-buttons">
              {["POINT", "LINESTRING", "POLYGON"].map(type => (
                <button
                  key={type}
                  className={selectedGeometryType === type ? "active-type-btn" : "type-btn"}
                  onClick={() => setSelectedGeometryType(type)}
                >
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            <div className="object-detail-list">
              {vectorSource.getFeatures().filter(f => {
                const pd = f.get("pointData");
                return pd && getWktType(pd.wkt) === selectedGeometryType;
              }).map((f, i) => {
                const pd = f.get("pointData");
                return (
                  <div key={i} className="object-detail-card" onClick={() => handleObjectFocus(selectedUserId, pd.type, pd.createdAt)}>
                    <div><strong>Created At:</strong> {formatDate(pd.createdAt)}</div>
                    <div><strong>Name:</strong> {pd.name || "-"}</div>
                    <div><strong>Created By:</strong> {pd.createdByUsername || "-"}</div>
                    <div>
                      <strong>WKT:</strong>{" "}
                      <code style={{ fontSize: "0.75rem", wordBreak: "break-word" }}>
                        {shortenWkt(pd.wkt)}
                      </code>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="admin-pagination">
        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>&laquo;</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} className={currentPage === i + 1 ? "active" : ""} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
        ))}
        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>&raquo;</button>
      </div>

      <ConfirmPanel isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleConfirmDelete} />
    </>
  );
};

export default UserPanel;
