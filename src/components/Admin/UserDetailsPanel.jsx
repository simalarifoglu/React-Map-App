import "./UserDetailsPanel.css";

const UserDetailsPanel = ({ isOpen, onClose, user, summary }) => {
  if (!isOpen || !user || !summary) return null;

  const renderSection = (title, data) => (
    <div className="details-section">
      <h3>{title}</h3>
      {data ? (
        <>
          <p><strong>Count:</strong> {data.count}</p>
          <div>
            <p><strong>Created At:</strong></p>
            <ul>{data.createdAtList.map((date, i) => <li key={i}>{new Date(date).toLocaleString()}</li>)}</ul>
          </div>
          <div>
            <p><strong>Deleted At:</strong></p>
            <ul>{data.deletedAtList.filter(d => d).map((date, i) => <li key={i}>{new Date(date).toLocaleString()}</li>)}</ul>
          </div>
        </>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );

  return (
    <div className="user-details-overlay">
      <div className="user-details-panel">
        <div className="user-details-header">
          <h2>User: {user.username}</h2>
          <button onClick={onClose} className="close-btn">x</button>
        </div>

        <div className="user-details-content">
          {renderSection("Points", summary.Point)}
          {renderSection("Linestrings", summary.Linestring)}
          {renderSection("Polygons", summary.Polygon)}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsPanel;
