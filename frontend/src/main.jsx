import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Create a root.
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// Initial render
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
