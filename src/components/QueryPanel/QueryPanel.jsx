import { useState, useEffect, useRef } from 'react';
import { useSelector,useDispatch } from "react-redux";
import { toast } from 'react-toastify'; 
import { getMap } from '../../MapView';
import zoomToFeature from '../../utils/ZoomPoint';
import { deleteFeature } from '../../redux/state/mapObjectsState';
import { setFeature } from '../../redux/state/featureState';
import { openPanel } from '../../redux/state/panelState';
import { onEditPanel } from '../../redux/state/panelState';
import './QueryPanel.css';

const QueryPanel = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { objects } = useSelector(state => state.object);
    const [animationClass, setAnimationClass] = useState('');
    const panelRef = useRef(null);
    
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

    const handleDelete = (id) => {
        if (confirm("Do you want to delete?")) {
            dispatch(deleteFeature(id));
            toast.success("Deleted successfully!");
        }else{
            toast.warning("Deletion process cancelled!");
        }
    };
    
    // Find the feature and zoom to it
    const handleShow = (id) => {
        console.log(`Zooming to feature with ID: ${id}`);
        const map = getMap(); // Get the map instance
        const feature = objects.find(obj => obj.id === id);
        
        if (feature && map) {
            console.log('Map and feature found, zooming...');
            zoomToFeature(map, feature);
            toast.success("Zooming: "+feature.name);

        } else {
            console.warn('Feature or map not found. Map:', map, 'Feature:', feature);
        }
        onClose();
    };
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
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>WKT</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {objects?.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.wkt}</td>
                                        <td>
                                            <button 
                                                className="update-btn"
                                                onClick={() => handleShow(item.id)}
                                            >
                                                Show
                                            </button>
                                            <button
                                                className="save-btn"
                                                onClick={() => handleEdit(item.id)}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
        </div>
    </>    
    );
};

export default QueryPanel;
