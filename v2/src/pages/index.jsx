import Landing from './Landing.jsx';
import Resources from './Resources.jsx';
import ServicesPage from './ServicesPage.jsx';
import Team from './Team.jsx';
import Contact from './Contact.jsx';
import Privacy from './Privacy.jsx';
import NotFound from './NotFound.jsx';

// Page id (see content/pages.js) -> component.
export const PAGE_COMPONENTS = {
    home: () => <Landing audienceId="local" />,
    international: () => <Landing audienceId="international" />,
    resources: Resources,
    services: ServicesPage,
    team: Team,
    contact: Contact,
    privacy: Privacy,
    notfound: NotFound
};
