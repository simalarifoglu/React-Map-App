import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllObjects } from "./redux/state/mapObjectsState";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header/Header";
import InitMap from "./utils/MapView";
import displayObj from "./utils/DisplayPoint";
import ConfirmPanel from "./components/ConfirmPanel/ConfirmPanel";
import { StopEditButton } from "./components/StopUpdate/StopUpdate";

function App() {
  const [isConfirmPanelOpen, setIsConfirmPanelOpen] = useState(false);
  const dispatch = useDispatch();
  const { objects } = useSelector(state => state.object);

  // Fetch objects on component mount
  useEffect(() => {
    dispatch(getAllObjects());
  }, [dispatch]);

  // Call displayObj whenever objects change
  useEffect(() => {
    if (objects && objects.length > 0) {
      displayObj(objects);
    }
  }, [objects]);

  return(
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      <StopEditButton/>
      <InitMap/>
      <ConfirmPanel
        isOpen={isConfirmPanelOpen}
        onClose={() => setIsConfirmPanelOpen(false)} 
      /> 
    </>
  );
}

export default App;