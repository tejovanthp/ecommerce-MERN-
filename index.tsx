
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Critical: Root element not found.");
}

const root = ReactDOM.createRoot(rootElement);

// Wrap in a micro-timeout to ensure DOM is settled
setTimeout(() => {
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Hide the loader overlay once render starts
    const loader = document.getElementById('initial-loader-overlay');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }
  } catch (err) {
    console.error("Mounting Error:", err);
  }
}, 10);
