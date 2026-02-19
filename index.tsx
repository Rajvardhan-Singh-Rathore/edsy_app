import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

function hideLoader() {
  const loader = document.getElementById('app-loader');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';
    setTimeout(() => loader.remove(), 300);
  }
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

requestAnimationFrame(() => {
  hideLoader();
});
