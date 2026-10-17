import { hydrateRoot } from 'react-dom/client';
import { PAGE_COMPONENTS } from './pages/index.jsx';

// Each HTML file is pre-rendered at build time (scripts/build.mjs). This attaches the interactivity.
const root = document.getElementById('root');
const Page = PAGE_COMPONENTS[root.dataset.page];
if (Page) hydrateRoot(root, <Page />);
