import Modal from "../Modal/Modal";
import { useSelector, useDispatch } from "react-redux";
import { clearFeature } from "../../redux/state/featureState";
import { deleteFeature, updateFeature } from "../../redux/state/mapObjectsState";
import { closePanel } from "../../redux/state/panelState";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { offEditPanel } from "../../redux/state/panelState";
import ConfirmPanel from "../ConfirmPanel/ConfirmPanel";
import { onEdit } from "../../redux/state/editState";
import { enableTranslateMode } from "../../utils/DragPoint";
import zoomToFeature from "../../utils/ZoomPoint";
import { getMap } from "../../utils/MapView";
import WKT from "ol/format/WKT";
import Feature from 'ol/Feature';
import { getFormattedLength } from '../../utils/CalculateLength';

const UpdatePanel = () => {
    const dispatch = useDispatch();
    const selectedFeature = useSelector(state => state.feature.feature);
    const isEdit = useSelector(state => state.panel.isEdit)
    const isOpen = useSelector((state) => state.panel.isOpen);
    const user = useSelector((state) => state.auth.user);
    const isAdmin = user?.role === "admin";
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedWkt, setEditedWkt] = useState("");
    const [confirmResolve, setConfirmResolve] = useState(null);
    const [isConfirmPanelOpen, setIsConfirmPanelOpen] = useState(false)

    useEffect(() => {
        if (selectedFeature) {
            setEditedName(selectedFeature.name || "");
            if (isEdit) {
                setIsEditing(isEdit);
                dispatch(offEditPanel());
            }
        }
    }, [selectedFeature]);
    const triggerEdit = () => {
        setIsEditing(true);
        const map = getMap();
        zoomToFeature(map, selectedFeature);
    };

    const triggerSave = async () => {
        const userConfirmed = await showConfirm();
        if (!userConfirmed) {
            triggerCancel();
            return;
        }

        try {
            const id = selectedFeature.id;
            const wktFormat = new WKT();
            const geometry = wktFormat.readGeometry(selectedFeature.wkt);
            const wkt = wktFormat.writeGeometry(geometry);

            const data = {
                name: editedName,
                wkt: wkt,
            };

            console.log("GÖNDERİLEN DATA:", JSON.stringify(data));

            await dispatch(updateFeature({ id, data }));

            setIsEditing(false);
            dispatch(offEditPanel());
            toast.success("Update completed successfully!");
        } catch (err) {
            console.error("Update error:", err);
            toast.error("An error occurred during update.");
        }
    };


    const triggerCancel = () => {
        setEditedName(selectedFeature.name);
        setIsEditing(false);
        toast.warning("Updation process cancelled!");
        dispatch(clearFeature());
        dispatch(closePanel());
    };
    const triggerDelete = async () => {
        const userConfirmed = await showConfirm();
        if (userConfirmed) {
            dispatch(deleteFeature(selectedFeature.id));
            dispatch(clearFeature());
            dispatch(closePanel());
            toast.success("Deletion completed successfully!");
        } else {
            toast.warning("Deletion process cancelled!");
        }
    };
    const handleClose = () => {
        dispatch(clearFeature());
        dispatch(closePanel());
        setEditedName('')
    };
    const handleDragDrop = () => {
        enableTranslateMode(selectedFeature, dispatch, showConfirm);
        dispatch(closePanel());
    }
    const handleModify = () => {
        const map = getMap();
        if (map && selectedFeature) {
            zoomToFeature(map, selectedFeature);
        }
        dispatch(closePanel());
        onEditFunction();
    }
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
    const onEditFunction = () => {
        dispatch(onEdit());
    }

    const wktFormat = new WKT();
    const geometryWkt = selectedFeature?.wkt || "";
    console.log("Feature:", selectedFeature);
    console.log("get(username):", selectedFeature?.get?.("username"));
    console.log("get(pointData):", selectedFeature?.get?.("pointData"));
    console.log("createdByUsername:", selectedFeature?.get?.("pointData")?.createdByUsername);

    const username =
        typeof selectedFeature?.get === "function"
            ? selectedFeature.get("createdByUsername") || selectedFeature.get("username") || selectedFeature.get("pointData")?.createdByUsername
            : selectedFeature?.createdByUsername || selectedFeature?.username || selectedFeature?.pointData?.createdByUsername;


    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} title="Modify Feature">
                {selectedFeature && (
                    <>
                        {isAdmin && selectedFeature?.createdByUsername && (
                            <div className="form-group">
                                <label className="edit-username">Created By: {selectedFeature.createdByUsername}</label>
                            </div>
                        )}

                        {isAdmin && selectedFeature?.createdAt && (
                            <div className="form-group">
                                <label className="edit-username">
                                    Created At:{" "}
                                    {new Date(selectedFeature.createdAt).toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </label>
                            </div>
                        )}

                        {geometryWkt.startsWith("LINESTRING") && (
                            <div className="form-group">
                                <label className="edit-username">
                                    Length: {getFormattedLength(geometryWkt)}
                                </label>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="name">Name:</label>
                            <input
                                id="name"
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="edit-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="wkt">WKT:</label>
                            <input
                                id="wkt"
                                type="text"
                                value={geometryWkt}
                                readOnly
                                className="edit-input"
                            />
                        </div>
                    </>
                )}

                <div className="edit-butonlari">
                    {isEditing ? (
                        <>
                            <button onClick={triggerSave} className="save-btn">Save</button>
                            <button onClick={triggerCancel} className="cancel-btn">Cancel</button>
                        </>
                    ) : (
                        <>
                            <button onClick={triggerEdit} className="save-btn">Update</button>
                            <button onClick={handleModify} className="modify-btn">Start Manual Update</button>
                            <button onClick={triggerDelete} className="delete-btn">Delete</button>
                            <button onClick={handleClose} className="close-btn">Close</button>
                        </>
                    )}
                </div>
            </Modal>
            <ConfirmPanel
                isOpen={isConfirmPanelOpen}
                onClose={() => setIsConfirmPanelOpen(false)}
                onConfirm={(value) => handleConfirmResult(value)}
            />
        </>
    );
};

export default UpdatePanel;
