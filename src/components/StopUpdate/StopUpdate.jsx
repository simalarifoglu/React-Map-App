import './StopUpdate.css';
import { onEdit, offEdit } from '../../redux/state/editState';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import ConfirmPanel from '../ConfirmPanel/ConfirmPanel';

export const StopEditButton = ({ onConfirmStop }) => {
  const dispatch = useDispatch();
  const visibility = useSelector(state => state.Edit.edit);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleClick = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirm = (confirmed) => {
    setIsConfirmOpen(false);
    if (confirmed) {
      dispatch(offEdit());
      if (onConfirmStop) onConfirmStop(true);
    } else {
      if (onConfirmStop) onConfirmStop(false);
    }
  };

  return (
    <>
      {visibility && (
        <div className="stop-editing-container">
          <button className="stop-editing" onClick={handleClick}>Stop Editing</button>
        </div>
      )}
      <ConfirmPanel
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </>
  );
};
