import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { PAGE_COMPONENTS } from './pages/index.jsx';

export { PAGES } from './content/pages.js';
export { FAQ } from './content/faq.js';
export { DE } from './content/de.js';
export const renderPage = (id) => renderToString(createElement(PAGE_COMPONENTS[id]));
