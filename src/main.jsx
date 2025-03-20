import { createRoot } from 'react-dom/client'
import '../style/index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.jsx';

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <App />
    </Provider>
)
