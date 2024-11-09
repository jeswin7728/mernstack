import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Importing global CSS styles
import App from './App'; // Importing the main App component
import reportWebVitals from './reportWebVitals'; // Optional performance measurement

// Create a root for rendering
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component inside React.StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Optional: Measure performance in your app
reportWebVitals();