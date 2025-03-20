import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllObjects } from "./redux/state/mapObjectsState";
import {ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "./components/Header/Header";
import InitMap from "./MapView";
import displayObj from "./DisplayPoint";

function App() {
  const dispatch = useDispatch();
  const { objects } = useSelector(state => state.object);
  useEffect(() => {
    dispatch(getAllObjects());
  }, [dispatch]);
  
  useEffect(() => {
    if (objects && objects.length > 0) {
      displayObj(objects);
    }
  }, [objects]);
  
  return(
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />
      <InitMap />
    </>
  );
}

export default App;
