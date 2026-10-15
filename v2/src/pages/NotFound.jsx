import Layout from '../components/Layout.jsx';
import { Container, Button } from '../components/ui.jsx';

export default function NotFound() {
    return (
        <Layout>
            <Container className="py-28 text-center max-w-2xl">
                <p className="text-mi-cyan text-sm font-bold tracking-widest uppercase mb-3">404</p>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Page not found</h1>
                <p className="text-mi-light/85 mb-8">The page you are looking for does not exist.</p>
                <Button href="/" className="mx-auto w-fit">Back to the homepage</Button>
            </Container>
        </Layout>
    );
}
