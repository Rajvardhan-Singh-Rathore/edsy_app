import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const MIN_LOADER_TIME = 2500; 

const startTime = Date.now();

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Could not find root element");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

const elapsed = Date.now() - startTime;
const remaining = Math.max(0, MIN_LOADER_TIME - elapsed);

setTimeout(mountApp, remaining);
