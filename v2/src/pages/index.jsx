import Landing from './Landing.jsx';
import Resources from './Resources.jsx';
import ServicesPage from './ServicesPage.jsx';
import Team from './Team.jsx';
import Contact from './Contact.jsx';
import Privacy from './Privacy.jsx';
import NotFound from './NotFound.jsx';
import SamplePage from './SamplePage.jsx';
import GuidePage from './GuidePage.jsx';
import LandingDe from './LandingDe.jsx';
import PrivacyDe from './PrivacyDe.jsx';
import Imprint from './Imprint.jsx';
import { GUIDES } from '../content/guides.js';
import { ModalProvider } from '../components/Layout.jsx';

// Every page is wrapped in the modal provider, so the booking form can be opened from anywhere on it.
// `audience` is what leads from that page are tagged with (see shared/packages.js); `lang` is the page language.
const withModal = (Page, audience = 'general', lang = 'en') => function PageWithModal() {
    return <ModalProvider audience={audience} lang={lang}><Page /></ModalProvider>;
};

// Page id (see content/pages.js) -> component.
export const PAGE_COMPONENTS = {
    home: withModal(() => <Landing audienceId="local" />, 'local'),
    international: withModal(() => <Landing audienceId="international" />, 'international'),
    de: withModal(LandingDe, 'de', 'de'),
    datenschutz: withModal(PrivacyDe, 'de', 'de'),
    impressum: withModal(Imprint, 'de', 'de'),
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
