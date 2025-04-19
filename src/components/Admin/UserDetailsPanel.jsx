import "./UserDetailsPanel.css";
import { useState } from "react";

const UserDetailsPanel = ({ isOpen, onClose, user, summary }) => {
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
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPanel;
