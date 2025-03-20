import Modal from "../Modal/Modal";
import { useSelector, useDispatch } from "react-redux";
import { clearFeature } from "../../redux/state/featureState";
import { deleteFeature, updateFeature } from "../../redux/state/mapObjectsState";
import { closePanel } from "../../redux/state/panelState";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { offEditPanel } from "../../redux/state/panelState";
import enableTranslateMode from "../../utils/DragPoint";

const UpdatePanel = () => {
    const dispatch = useDispatch();
    const selectedFeature = useSelector(state => state.feature.feature);
    const isEdit = useSelector(state => state.panel.isEdit)
    const isOpen = useSelector((state) => state.panel.isOpen);
    const [isEditing, setIsEditing] = useState(false); 
    const [editedName, setEditedName] = useState("");
    const [editedWkt, setEditedWkt] = useState("");

    useEffect(() => {
        if (selectedFeature) {
            setEditedName(selectedFeature.name || "");
            setEditedWkt(selectedFeature.wkt || "");
            if(isEdit){
                setIsEditing(isEdit);
                dispatch(offEditPanel());
            }
        }
    }, [selectedFeature]); 
    const triggerEdit = () => {
        setIsEditing(true);
    };
    const triggerSave = () => {
        if(confirm("save? ")){
        const data = {
            name: editedName,
            wkt: editedWkt
        }
        console.log(editedWkt)
        dispatch(updateFeature({ id: selectedFeature.id, data: data }));
        setIsEditing(false); 
        dispatch(offEditPanel());
        toast.success("update!");
    }else{triggerCancel()}
    };
    const triggerCancel = () => {
        setEditedName(selectedFeature.name); 
        setEditedWkt(selectedFeature.wkt);
        setIsEditing(false); 
        toast.warning("cancel");

    };
    const triggerDelete = () => {
        if (confirm("Do you want to delete?")) {
            dispatch(deleteFeature(selectedFeature.id));
            dispatch(clearFeature());
            dispatch(closePanel());
            toast.success("delete!");
        } else {
            toast.warning("cancel");
        }
    };
    const handleClose = () => {
        dispatch(clearFeature());
        dispatch(closePanel());
        setEditedName('')
        setEditedWkt('')
    };
    const handleDragDrop = () => {
        enableTranslateMode(selectedFeature,dispatch);
        dispatch(closePanel());
    }
    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            {selectedFeature && (
                <>
                    <div>
                        <table className="table-container">
                            <tbody>
                                <tr>
                                    <td><strong>Name:</strong> </td>
                                    <td style={{padding:"0px 12px"}}>
                                        {isEditing ? (
                                            <input 
                                                type="text"
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                            />
                                        ) : (
                                            editedName
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>WKT:</strong> </td>
                                    <td style={{padding:"0px 12px"}}>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedWkt}
                                                onChange={(e) => setEditedWkt(e.target.value)}
                                            />
                                        ) : (
                                            editedWkt
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
            )}
            <div className="edit-butonlari">
                {isEditing ? (
                    <>
                        <button onClick={triggerSave} className="save-btn">Save</button>
                        <button onClick={triggerCancel} className="delete-btn">Cancel</button>
                    </>
                ) : (
                    <>
                        <button onClick={triggerEdit} className="save-btn">Update</button>
                        <button onClick={handleDragDrop} className="save-btn">Drag</button>
                        <button onClick={triggerDelete} className="delete-btn">Delete</button>
                        <button onClick={handleClose} className="close-btn">Close</button>
                    </>
                )}
            </div>
        </Modal>
    );
};

export default UpdatePanel;
