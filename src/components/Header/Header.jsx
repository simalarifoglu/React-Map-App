import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AddPointPanel from '../AddPointPanel/AddPointPanel';
import QueryPanel from '../QueryPanel/QueryPanel';
import enableDrawMode from '../../utils/DrawPoint';
import { logout } from '../../redux/state/authState';
import './Header.css';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isQueryPanelOpen, setIsQueryPanelOpen] = useState(false);
  const [isAddPointPanelOpen, setIsAddPointPanelOpen] = useState(false);
  const visibility = useSelector(state => state.Edit.edit);
  const { user, isInitialized } = useSelector(state => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isInitialized) {
    return null;
  }  
  
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
      console.error("Logout error:", error);
    }
  };

  return (
    !visibility && (
      <header className="Header">
        <div className="header-top">
          <h1>Turkey Map</h1>
        </div>

        <div className="button-group">
          <button onClick={() => enableDrawMode('Point', dispatch, setIsAddPointPanelOpen)}>Add Point</button>
          <button onClick={() => enableDrawMode('LineString', dispatch, setIsAddPointPanelOpen)}>Add Linestring</button>
          <button onClick={() => enableDrawMode('Polygon', dispatch, setIsAddPointPanelOpen)}>Add Polygon</button>
          <button onClick={() => setIsQueryPanelOpen(true)}>Query Panel</button>
        </div>

        <AddPointPanel
          isOpen={isAddPointPanelOpen} 
          onClose={() => setIsAddPointPanelOpen(false)}
          title={<span className="add-feature-title">Add Object</span>}
          position="right"
        />

        <QueryPanel 
          isOpen={isQueryPanelOpen} 
          onClose={() => setIsQueryPanelOpen(false)} 
        />    
        <div className="header-right">
  {user ? (
    <div
      className="dropdown"
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      <span className="welcome-text">
        {user?.username ? `WELCOME, ${user.username}` : "..."}
      </span>
          {isDropdownOpen && (
            <div className="dropdown-content">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      ) : (
        <button onClick={() => navigate("/login")}>Login</button>
      )}
    </div>

      </header>
    )
  );
}

export default Header;
