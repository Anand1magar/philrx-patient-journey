import React from 'react';
import ReactDOM from 'react-dom/client';
import '@ds/styles.css';
import { Agentation } from 'agentation';
import { App } from './App.jsx';

// The /flow navigator is a meta-tool for browsing the app's own screens —
// Agentation's floating review button has no page of its own to annotate
// there and just sits on top of whatever screen is being previewed, so it's
// suppressed on that route specifically (still available everywhere else).
const isFlowNavigator = window.location.pathname.startsWith('/flow');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {import.meta.env.DEV && !isFlowNavigator && <Agentation endpoint="http://localhost:4747" />}
  </React.StrictMode>
);
