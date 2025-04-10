import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilteredObjects } from "./redux/state/mapObjectsState";
import { loginSuccess, logout } from "./redux/state/authState"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header/Header";
import InitMap from "./utils/MapView";
import displayObj from "./utils/DisplayPoint";
import ConfirmPanel from "./components/ConfirmPanel/ConfirmPanel";
import { StopEditButton } from "./components/StopUpdate/StopUpdate";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function MapPage() {
  const [isConfirmPanelOpen, setIsConfirmPanelOpen] = useState(false);
  const dispatch = useDispatch();
  const { objects } = useSelector((state) => state.object);

  useEffect(() => {
    dispatch(getFilteredObjects());
  }, [dispatch]);

  useEffect(() => {
    if (objects && objects.length > 0) {
      displayObj(objects);
    }
  }, [objects]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      <StopEditButton />
      <InitMap />
      <ConfirmPanel
        isOpen={isConfirmPanelOpen}
        onClose={() => setIsConfirmPanelOpen(false)}
      />
    </>
  );
}

function App() {
  const dispatch = useDispatch();

  const logoutAndClearData = () => {
    dispatch(logout());
    dispatch(clearObjects());
    localStorage.removeItem("user");
  };
  

  useEffect(() => {
    fetch("https://localhost:7176/api/Auth/me", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        const userData = {
          email: data.email,
          role: data.role,
          id: data.id,
          username: data.username
        };
        
        dispatch(loginSuccess({ token: null, user: userData }));
        localStorage.setItem("user", JSON.stringify(userData));
        dispatch(getFilteredObjects());
      })
      .catch((err) => {
        logoutAndClearData();
      });
  }, [dispatch]);
  
  

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <MapPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
