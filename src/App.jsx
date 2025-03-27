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
  const { objects } = useSelector((state) => state.object);

  // Sayfa yüklendiğinde objeleri getir
  useEffect(() => {
    dispatch(getAllObjects());
  }, [dispatch]);

  // Objeler değiştiğinde ekrana yansıt
  useEffect(() => {
    if (objects && objects.length > 0) {
      displayObj(objects);
    }
  }, [objects]);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/map"
          element={
            <>
              <StopEditButton />
              <InitMap />
              <ConfirmPanel
                isOpen={isConfirmPanelOpen}
                onClose={() => setIsConfirmPanelOpen(false)}
              />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
