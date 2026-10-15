import Landing from './Landing.jsx';
import Resources from './Resources.jsx';
import ServicesPage from './ServicesPage.jsx';
import Team from './Team.jsx';
import Contact from './Contact.jsx';
import Privacy from './Privacy.jsx';
import NotFound from './NotFound.jsx';
import SamplePage from './SamplePage.jsx';
import GuidePage from './GuidePage.jsx';
import { GUIDES } from '../content/guides.js';
import { ModalProvider } from '../components/Layout.jsx';

// Every page is wrapped in the modal provider, so the booking form can be opened from anywhere on it.
// `audience` is what leads from that page are tagged with (see shared/packages.js).
const withModal = (Page, audience = 'general') => function PageWithModal() {
    return <ModalProvider audience={audience}><Page /></ModalProvider>;
};

// Page id (see content/pages.js) -> component.
export const PAGE_COMPONENTS = {
    home: withModal(() => <Landing audienceId="local" />, 'local'),
    international: withModal(() => <Landing audienceId="international" />, 'international'),
    resources: withModal(Resources),
    services: withModal(ServicesPage),
    team: withModal(Team),
    contact: withModal(Contact),
    privacy: withModal(Privacy),
    sample: withModal(SamplePage),
    notfound: withModal(NotFound),
    // One component per guide: guide-<slug>
    ...Object.fromEntries(GUIDES.map((g) => [`guide-${g.slug}`, withModal(() => <GuidePage slug={g.slug} />)]))
};
