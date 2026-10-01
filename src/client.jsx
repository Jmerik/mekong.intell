import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

// The HTML is pre-rendered at build time (scripts/build.mjs); this attaches the interactivity.
hydrateRoot(document.getElementById('root'), <App />);
