import Layout from '../components/Layout.jsx';
import Hero from '../components/Hero.jsx';
import Pillars from '../components/Pillars.jsx';
import Services from '../components/Services.jsx';
import TrustStrip from '../components/TrustStrip.jsx';
import { SampleTeaser } from '../components/Sample.jsx';
import Faq from '../components/Faq.jsx';
import { AUDIENCES } from '../content/audiences.js';

// One template for both audience pages. All wording comes from content/audiences.js.
export default function Landing({ audienceId }) {
    const audience = AUDIENCES[audienceId];
    return (
        <Layout>
            <Hero audience={audience} />
            <TrustStrip />
            <SampleTeaser />
            <Pillars audience={audience} />
            <Services audience={audience} />
            <Faq audienceId={audienceId} />
        </Layout>
    );
}
