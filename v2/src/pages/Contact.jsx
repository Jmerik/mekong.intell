import { useState } from 'react';
import Layout from '../components/Layout.jsx';
import LeadForm from '../components/LeadForm.jsx';
import { Container, Icons } from '../components/ui.jsx';
import { SITE } from '../content/site.js';

export default function Contact() {
    const [sent, setSent] = useState(false);
    return (
        <Layout current="/contact">
            <header className="bg-mi-dark1 pt-16 pb-12 text-center">
                <Container className="max-w-3xl">
                    <p className="text-mi-cyan text-sm font-bold tracking-widest uppercase mb-3">Contact</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">Let's talk.</h1>
                    <p className="text-xl text-mi-light/85">Send a short message, or reach us directly on Telegram. We typically respond within 2 hours on Telegram.</p>
                </Container>
            </header>

            <section className="pb-20 bg-mi-dark1">
                <Container className="max-w-6xl grid lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 bg-mi-dark2 border border-mi-blue/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
                        {sent ? (
                            <div className="text-center py-12" role="status">
                                <div className="w-16 h-16 bg-mi-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6 text-mi-cyan"><Icons.CheckCircle2 size={32} /></div>
                                <h2 className="text-2xl font-bold text-white mb-3">Message received</h2>
                                <p className="text-mi-light/85">Thanks. We will be in touch shortly.</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
                                <LeadForm packageType="contact" idPrefix="c" showAudience onSuccess={() => setSent(true)} />
                            </>
                        )}
                    </div>

                    <aside className="lg:col-span-2 space-y-6">
                        <div className="bg-mi-dark2 border border-mi-blue/20 rounded-3xl p-6">
                            <h2 className="text-xl font-bold text-white mb-3">Message us directly</h2>
                            <p className="text-mi-light/85 mb-4">The fastest way to reach us.</p>
                            <a href={SITE.telegramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border-2 border-mi-cyan text-mi-cyan font-bold hover:bg-mi-cyan/10 transition-colors">
                                <Icons.Send size={18} /> @mekongintelligence
                            </a>
                        </div>
                        <div className="bg-mi-dark2 border border-mi-blue/20 rounded-3xl p-6">
                            <h2 className="text-xl font-bold text-white mb-3">Office</h2>
                            <p className="flex items-start gap-3 text-mi-light/85"><Icons.MapPin size={20} className="text-mi-cyan shrink-0 mt-0.5" /><span>{SITE.location}<br /><span className="text-mi-light/70">Street address to follow.</span></span></p>
                            <p className="flex items-start gap-3 text-mi-light/85 mt-4"><Icons.Mail size={20} className="text-mi-cyan shrink-0 mt-0.5" /><span>Email address to follow.</span></p>
                        </div>
                    </aside>
                </Container>
            </section>
        </Layout>
    );
}
