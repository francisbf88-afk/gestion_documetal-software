import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

// Configurar axios para desarrollo
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = 'http://localhost:5000';
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);