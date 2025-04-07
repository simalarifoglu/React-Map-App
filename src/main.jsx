import { createRoot } from 'react-dom/client'
import React from "react";
import '../style/index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.jsx';

createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  // </React.StrictMode>
)
