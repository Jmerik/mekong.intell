import { useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import LeadForm from '../components/LeadForm.jsx';
import { Container, Icons } from '../components/ui.jsx';
import { SITE } from '../content/site.js';
import { INTERESTS } from '../../shared/packages.js';

// Two columns: direct channels and office on the left, the inquiry form on the right.
// /contact?interest=sprint pre-selects the service a visitor came from (the service buttons link here).
export default function Contact() {
    const [sent, setSent] = useState(false);
    const [interest, setInterest] = useState('');

    useEffect(() => {
        const wanted = new URLSearchParams(window.location.search).get('interest');
        if (INTERESTS.includes(wanted)) setInterest(wanted);
    }, []);

    return (
        <Layout current="/contact">
            <header className="bg-mi-dark1 pt-16 pb-12 text-center">
                <Container className="max-w-3xl">
                    <p className="text-mi-cyan text-sm font-bold tracking-widest uppercase mb-3">Contact Us</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Let's talk.</h1>
                    <p className="text-xl text-mi-light/85">Tell us briefly about your setup or goals. We reply by email {SITE.replyTime}, or you can connect with us directly on Telegram.</p>
                </Container>
            </header>

            <section className="pb-20 bg-mi-dark1">
                <Container className="max-w-6xl grid lg:grid-cols-5 gap-8">
                    <aside className="lg:col-span-2 space-y-6">
                        <div className="bg-mi-dark2 border border-mi-blue/20 rounded-3xl p-6">
                            <h2 className="text-xl font-bold text-white mb-1">Telegram</h2>
                            <p className="text-mi-light/85 mb-4">Fastest response. Directly connected to our team.</p>
                            <a href={SITE.telegramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border-2 border-mi-cyan text-mi-cyan font-bold hover:bg-mi-cyan/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mi-cyan">
                                <Icons.Send size={18} /> Connect on Telegram
                            </a>
                        </div>
                        <div className="bg-mi-dark2 border border-mi-blue/20 rounded-3xl p-6">
                            <h2 className="text-xl font-bold text-white mb-3">Office location</h2>
                            <p className="flex items-start gap-3 text-mi-light/85"><Icons.MapPin size={20} className="text-mi-cyan shrink-0 mt-0.5" /><span>{SITE.location}</span></p>
                        </div>
                        <div className="bg-mi-dark2 border border-mi-blue/20 rounded-3xl p-6">
                            <h2 className="text-xl font-bold text-white mb-3">Email and inquiries</h2>
                            <p className="flex items-start gap-3 text-mi-light/85"><Icons.Mail size={20} className="text-mi-cyan shrink-0 mt-0.5" /><span>Use the inquiry form and we reply by email {SITE.replyTime}.</span></p>
                        </div>
                    </aside>

                    <div className="lg:col-span-3 bg-mi-dark2 border border-mi-blue/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
                        {sent ? (
                            <div className="text-center py-12" role="status">
                                <div className="w-16 h-16 bg-mi-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6 text-mi-cyan"><Icons.CheckCircle2 size={32} /></div>
                                <h2 className="text-2xl font-bold text-white mb-3">Inquiry received</h2>
                                <p className="text-mi-light/85">Thanks. We will reply {SITE.replyTime}.</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-white mb-6">Send an inquiry</h2>
                                <LeadForm packageType="contact" interest={interest} idPrefix="c" onSuccess={() => setSent(true)} />
                            </>
                        )}
                    </div>
                </Container>
            </section>
        </Layout>
    );
}
