import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Create a root and render the App component
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
