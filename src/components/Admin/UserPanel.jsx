import { useEffect, useState, useMemo } from "react";
import "./AdminMainPanel.css";
import ConfirmPanel from "../ConfirmPanel/ConfirmPanel";
import { toast } from "react-toastify";
import Fuse from "fuse.js";
import React from "react";

const UserPanel = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDir, setSortDir] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  useEffect(() => {
    fetch("https://localhost:7176/api/Auth/users", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.value || []))
      .catch((err) => console.error("Kullanıcılar alınamadı:", err));
  }, []);

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
      setSelectedDetails(data);
      setIsDetailsPanelOpen(true);
    } catch (err) {
      console.error("Detaylar alınamadı:", err);
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

  const fuse = useMemo(() => {
    return new Fuse(users, {
      keys: ["username", "email"],
      threshold: 0.3,
      includeMatches: true,
    });
  }, [users]);

  const fuseResults = useMemo(() => {
    if (!search) return users.map(user => ({ item: user, matches: [] }));
    return fuse.search(search);
  }, [search, fuse]);

  const sortFn = (a, b) => {
    if (!sortField) return 0;
    const aVal = a.item[sortField].toLowerCase();
    const bVal = b.item[sortField].toLowerCase();
    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  };

  const sortedUsers = [...fuseResults].sort(sortFn);
  const totalPages = Math.ceil(sortedUsers.length / perPage);
  const paginated = sortedUsers.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const highlightMatch = (text, matches, key) => {
    const match = matches.find((m) => m.key === key);
    if (!match || !match.indices.length) return text;
  
    const parts = [];
    let lastIndex = 0;
  
    match.indices.forEach(([start, end], i) => {
      if (lastIndex < start) {
        parts.push(<span key={`normal-${i}`}>{text.slice(lastIndex, start)}</span>);
      }
      parts.push(<mark key={`mark-${i}`}>{text.slice(start, end + 1)}</mark>);
      lastIndex = end + 1;
    });
  
    if (lastIndex < text.length) {
      parts.push(<span key="last">{text.slice(lastIndex)}</span>);
    }
  
    return parts;
  };
  

  return (
    <>
      <div className="admin-header">
        <h2 className="admin-title">Registered Users</h2>
      </div>

      <input
        className="admin-search-input"
        type="text"
        placeholder="Search by username or email..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      <table className="admin-table">
        <thead>
          <tr>
            <th className="clickable" onClick={() => handleSort("username")}>Username <span className="arrow">{sortField === "username" ? (sortDir === "asc" ? "▲" : "▼") : ""}</span></th>
            <th className="clickable" onClick={() => handleSort("email")}>Email <span className="arrow">{sortField === "email" ? (sortDir === "asc" ? "▲" : "▼") : ""}</span></th>
            <th className="clickable" onClick={() => handleSort("role")}>Role <span className="arrow">{sortField === "role" ? (sortDir === "asc" ? "▲" : "▼") : ""}</span></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length > 0 ? (
            paginated.map(({ item, matches }) => (
              <tr key={item.id}>
                <td className="highlight-cell">{highlightMatch(item.username, matches, "username")}</td>
                <td className="highlight-cell">{highlightMatch(item.email, matches, "email")}</td>
                <td>{item.role}</td>
                <td>
                  <button className="view-btn" onClick={() => fetchUserDetails(item.id)}>View Details</button>
                  <button className="delete-btn" onClick={() => handleDeleteUser(item.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="empty-cell" style={{ textAlign: "center", padding: "20px", color: "#b8503b" }}>No results found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {isDetailsPanelOpen && (
        <div className="overlay-modal">
          <div className="details-modal-centered">
            <div className="details-header">
              <h3>User Object Details</h3>
              <button onClick={() => setIsDetailsPanelOpen(false)} className="close-btn">X</button>
            </div>

            <table className="details-table">
              <thead>
                <tr>
                  <th>Object</th>
                  <th>Count</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {["point", "linestring", "polygon"].map((type) => {
                  const details = selectedDetails?.[type];
                  const created = details?.createdAtList || [];

                  const maxLength = Math.max(created.length, 1);

                  return (
                    <React.Fragment key={type}>
                      {Array.from({ length: maxLength }).map((_, index) => (
                        <tr key={`${type}-${index}`}>
                          {index === 0 ? (
                            <>
                              <td rowSpan={maxLength} style={{ fontWeight: "bold", verticalAlign: "top" }}>{type}</td>
                              <td rowSpan={maxLength}>{details?.count ?? 0}</td>
                            </>
                          ) : null}
                          <td>{created[index] ? formatDate(created[index]) : "-"}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
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
