import { useState, useEffect, useRef } from 'react';
import { useSelector,useDispatch } from "react-redux";
import { toast } from 'react-toastify'; 
import { getMap } from '../../utils/MapView';
import zoomToFeature from '../../utils/ZoomPoint';
import { deleteFeature } from '../../redux/state/mapObjectsState';
import { setFeature } from '../../redux/state/featureState';
import { openPanel } from '../../redux/state/panelState';
import { onEditPanel } from '../../redux/state/panelState';
import ConfirmPanel from '../ConfirmPanel/ConfirmPanel';
import './QueryPanel.css';

const QueryPanel = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { objects } = useSelector(state => state.object);
    const [animationClass, setAnimationClass] = useState('');
    const [confirmResolve, setConfirmResolve] = useState(null);
    const [isConfirmPanelOpen, setIsConfirmPanelOpen] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState(null);
    const panelRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    const user = useSelector((state) => state.auth.user|| {});
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        if (isOpen) {
            setAnimationClass('panel-open');
            document.body.style.overflow = 'hidden';
        } else {
            setAnimationClass('panel-close');
            document.body.style.overflow = 'auto';
        }
    }, [isOpen]);

    if (!isOpen && animationClass !== 'panel-open') return null;

    const handleEdit = (id) => {
        const feature = objects.find(obj => obj.id === id);
        if (feature) {
            
            dispatch(setFeature(feature))
            dispatch(openPanel())
            dispatch(onEditPanel());
        }
    };

    const handleDelete = async (id) => {
        const userConfirmed = await showConfirm();
        if (userConfirmed) {
            dispatch(deleteFeature(id));
            toast.success("Deletion completed successfully!");
        } else {
            toast.warning("Deletion process cancelled!");
        }
    };

    const showConfirm = () => {
        return new Promise((resolve) => {
            setConfirmResolve(() => resolve);
            setIsConfirmPanelOpen(true);
        });
    };
    
    const handleConfirmResult = (result) => {
        if (confirmResolve) {
            confirmResolve(result);
            setConfirmResolve(null);
        }
        setIsConfirmPanelOpen(false);
    };    
    
    const handleShow = (id) => {
        const map = getMap();
        const feature = objects.find(obj => obj.id === id);
        
        if (feature && map) {
            zoomToFeature(map, feature);

        } else {
            console.warn('Feature or map not found. Map:', map, 'Feature:', feature);
        }
        onClose();
    };

    const filteredObjects = objects.filter(obj =>
        obj.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedObjects = filteredObjects.slice(startIndex, endIndex);
      
      const totalPages = Math.ceil(filteredObjects.length / itemsPerPage);      
      
    return (
    <>
        <div className={`query-panel-overlay ${animationClass}`}>
            <div
                className={`query-panel-container ${animationClass}`}
                ref={panelRef}
            >
                <div className="query-panel-header">
                    <h2>Query Results</h2>
                    <button className="query-panel-close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <div className="query-panel-body">
                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    </div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>WKT</th>
                                    {isAdmin && <th>Created By</th>}
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedObjects.length > 0 ? (
                                paginatedObjects.map(obj => (
                                    <tr key={obj.id}>
                                    <td>{obj.name}</td>
                                    <td>{obj.wkt}</td>
                                    {isAdmin && <td>{obj.createdByUsername || "-"}</td>}
                                    <td>
                                        <button className="update-btn" onClick={() => handleShow(obj.id)}>Show</button>
                                        <button className="save-btn" onClick={() => handleEdit(obj.id)}>Update</button>
                                        <button className="delete-btn" onClick={() => handleDelete(obj.id)}>Delete</button>
                                    </td>
                                    </tr>
                                ))
                                ) : (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', color: '#b8503b' }}>
                                    No matching results found.
                                    </td>
                                </tr>
                                )}
                        </tbody>
                        </table>
                    </div>
                    <div className="pagination">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        >
                        &laquo;
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={currentPage === i + 1 ? 'active' : ''}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                        ))}
                        <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        >
                        &raquo;
                        </button>
                </div>
                </div>
            </div>
        </div>
        <ConfirmPanel
    isOpen={isConfirmPanelOpen}
    onClose={() => setIsConfirmPanelOpen(false)}
    onConfirm={(value) => handleConfirmResult(value)}
/>
    </>    
    
    );
};

export default QueryPanel;
