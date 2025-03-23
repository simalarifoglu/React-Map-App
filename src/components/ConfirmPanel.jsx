import Modal from "./Modal/Modal";
const ConfirmPanel = ({ isOpen, onClose, onConfirm }) => {
    
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Confirm Your Action">
        <div className="confirm-container">
          <div className="confirm-btn-container">
            <button className="delete-btn" onClick={() => onConfirm(true)}>Yes</button>
            <button className="update-btn" onClick={() => onConfirm(false)}>No</button>
          </div>
        </div>
      </Modal>
    );
  };
  
  export default ConfirmPanel;
  