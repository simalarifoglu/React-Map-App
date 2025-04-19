import "./UserDetailsPanel.css";
import { useState } from "react";

const UserDetailsPanel = ({ isOpen, onClose, user, summary, objects }) => {
  if (!isOpen || !user || !summary) return null;

  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(prev => (prev === section ? null : section));
  };

  const renderSection = (title, key, data) => (
    <div className="details-section">
      <div className="section-header" onClick={() => toggleSection(key)}>
        <h3>{title}</h3>
        <span>{openSection === key ? "▲" : "▼"}</span>
      </div>
      {openSection === key && (
        <div className="section-body">
          {data ? (
            <>
              <p><strong>Count:</strong> {data.count}</p>

              {data.createdAtList?.length > 0 && (
                <>
                  <p><strong>Created At:</strong></p>
                  <ul>
                    {data.createdAtList.map((date, i) => (
                      <li key={i}>{new Date(date).toLocaleString()}</li>
                    ))}
                  </ul>
                </>
              )}

              {data.deletedAtList?.filter(Boolean).length > 0 && (
                <>
                  <p><strong>Deleted At:</strong></p>
                  <ul>
                    {data.deletedAtList.filter(d => d).map((date, i) => (
                      <li key={i}>{new Date(date).toLocaleString()}</li>
                    ))}
                  </ul>
                </>
              )}
            </>
          ) : (
            <p>No data available.</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="user-details-overlay">
      <div className="user-details-panel">
        <div className="user-details-header">
          <h2>User: {user.username}</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="user-details-content">
        {renderSection("Points", "Point", summary.Point)}
          {renderSection("Linestrings", "Linestring", summary.Linestring)}
          {renderSection("Polygons", "Polygon", summary.Polygon)}

          {objects && objects.length > 0 && (
            <div className="details-section">
              <div className="section-header" onClick={() => toggleSection("Objects")}>
                <h3>Object List</h3>
                <span>{openSection === "Objects" ? "▲" : "▼"}</span>
              </div>
              {openSection === "Objects" && (
                <div className="section-body">
                  <table className="object-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {objects.map((obj) => (
                        <tr key={obj.id}>
                          <td>{obj.id}</td>
                          <td>{obj.name}</td>
                          <td>{obj.type}</td>
                          <td>{new Date(obj.createdAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPanel;