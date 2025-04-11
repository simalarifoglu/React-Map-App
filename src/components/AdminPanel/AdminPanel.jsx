import { useEffect, useState } from "react";
import "./AdminPanel.css";
import ConfirmPanel from "../ConfirmPanel/ConfirmPanel";
import { toast } from "react-toastify";

const AdminPanel = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetch("https://localhost:7176/api/Auth/users", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setUsers(data.value || []))
        .catch((err) => console.error("Kullanıcılar alınamadı:", err));
    }
  }, [isOpen]);

  const handleDeleteUser = (id) => {
    setSelectedUserId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async (confirm) => {
    if (confirm && selectedUserId) {
      try {
        const response = await fetch(`https://localhost:7176/api/Auth/delete-user/${selectedUserId}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (response.ok) {
          setUsers(prev => prev.filter(user => user.id !== selectedUserId));
          toast.success("Deletion completed successfully!");
        } else {
          toast.error("Failed to delete user.");
        }
      } catch (error) {
        toast.error("Error deleting user.");
        console.error("Error deleting user:", error);
      }
    }
    setIsConfirmOpen(false);
    setSelectedUserId(null);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const fieldA = a[sortField]?.toLowerCase?.() ?? "";
    const fieldB = b[sortField]?.toLowerCase?.() ?? "";

    if (sortDirection === "asc") return fieldA.localeCompare(fieldB);
    return fieldB.localeCompare(fieldA);
  });

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + usersPerPage);

  return (
    <div className={`admin-panel-overlay ${isOpen ? "panel-open" : ""}`}>
      <div className={`admin-panel-container ${isOpen ? "panel-open" : ""}`}>
        <div className="admin-header">
          <h2>Registered Users</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="admin-search-container">
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("username")} className="clickable">
                  Username <span className="arrow">{sortField === "username" ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}</span>
                </th>
                <th onClick={() => handleSort("email")} className="clickable">
                  Email <span className="arrow">{sortField === "email" ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}</span>
                </th>
                <th onClick={() => handleSort("role")} className="clickable">
                  Role <span className="arrow">{sortField === "role" ? (sortDirection === "asc" ? " ▲" : " ▼") : ""}</span>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete user"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-cell">No users found.</td>
                </tr>
              )}
              {Array.from({ length: usersPerPage - paginatedUsers.length }).map((_, i) => (
                <tr key={`empty-${i}`} className="empty-row">
                  <td colSpan="4">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-pagination">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>&laquo;</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>&raquo;</button>
        </div>
      </div>

      <ConfirmPanel
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AdminPanel;
