import "./ConfirmationModal.css";

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Confirm Deletion</h3>
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
          <button onClick={onConfirm} className="confirm-btn">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
