import Gateway from './Gateway.jsx';
import Landing from './Landing.jsx';
import Resources from './Resources.jsx';
import Pricing from './Pricing.jsx';
import Team from './Team.jsx';
import Contact from './Contact.jsx';
import Privacy from './Privacy.jsx';
import NotFound from './NotFound.jsx';

// Page id (see content/pages.js) -> component.
export const PAGE_COMPONENTS = {
    home: Gateway,
    local: () => <Landing audienceId="local" />,
    international: () => <Landing audienceId="international" />,
    resources: Resources,
    pricing: Pricing,
    team: Team,
    contact: Contact,
    privacy: Privacy,
    notfound: NotFound
};
