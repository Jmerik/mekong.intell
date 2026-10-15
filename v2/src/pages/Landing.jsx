import Layout from '../components/Layout.jsx';
import Hero from '../components/Hero.jsx';
import Pillars from '../components/Pillars.jsx';
import Rhythm from '../components/Rhythm.jsx';
import Services from '../components/Services.jsx';
import { AUDIENCES } from '../content/audiences.js';

// One template for both audience pages. All wording comes from content/audiences.js.
export default function Landing({ audienceId }) {
    const audience = AUDIENCES[audienceId];
    return (
        <Layout audience={audience.id}>
            <Hero audience={audience} />
            <Pillars audience={audience} />
            <Rhythm />
            <Services audience={audience} />
        </Layout>
    );
}
