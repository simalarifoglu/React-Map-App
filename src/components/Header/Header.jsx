import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import AddPointPanel from '../AddPointPanel/AddPointPanel';
import QueryPanel from '../QueryPanel/QueryPanel';
import enableDrawMode from '../../utils/DrawPoint';
import './Header.css';

function Header() {
  const dispatch = useDispatch();
  const [isQueryPanelOpen, setIsQueryPanelOpen] = useState(false);
  const [isAddPointPanelOpen, setIsAddPointPanelOpen] = useState(false);
  const visibility = useSelector(state => state.Edit.edit)

  return (
    !visibility && (
    <header>
      <div className='Header'>
        <h1>Türkiye Haritası</h1>
        <div className='button-group'>
          <>
        <button onClick={() => enableDrawMode('Point', dispatch, setIsAddPointPanelOpen)}>Add Point</button>
        <button onClick={() => enableDrawMode('LineString', dispatch, setIsAddPointPanelOpen)}>Add Linestring</button>
        <button onClick={() => enableDrawMode('Polygon', dispatch, setIsAddPointPanelOpen)}>Add Polygon</button>
        <button onClick={() => setIsQueryPanelOpen(true)}>Query Panel</button>
        </>
        </div>
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
    </header>
  ));
}

export default Header;