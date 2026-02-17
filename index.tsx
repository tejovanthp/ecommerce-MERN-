
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const hideLoader = () => {
  const loader = document.getElementById('initial-loader-overlay');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => { loader.style.display = 'none'; }, 500);
  }
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  // Hide loader immediately after trigger
  hideLoader();
}
