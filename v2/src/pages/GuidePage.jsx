import Layout, { useModal } from '../components/Layout.jsx';
import { Container, Button, Icons } from '../components/ui.jsx';
import { guideBySlug, GUIDES, GUIDE_AUTHOR } from '../content/guides.js';
import { QUICK_LOOK } from '../content/site.js';

const formatDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

// One guide per page. All wording comes from content/guides.js.
export default function GuidePage({ slug }) {
    const { startQuickLook } = useModal();
    const guide = guideBySlug(slug);
    const related = guide.related.map((s) => guideBySlug(s));

    return (
        <Layout current="/resources">
            <article className="bg-mi-dark1 pt-12 pb-16">
                <Container className="max-w-3xl">
                    <nav aria-label="Breadcrumb" className="text-sm text-mi-light/70 mb-6">
                        <a href="/resources" className="underline hover:text-white">Resources</a> <span aria-hidden="true">/</span> <span>{guide.short}</span>
                    </nav>
                    <p className="text-mi-cyan text-sm font-bold tracking-widest uppercase mb-3">{guide.label}</p>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">{guide.title}</h1>
                    <p className="text-sm text-mi-light/70 mb-8">
                        By {GUIDE_AUTHOR} &middot; Published <time dateTime={guide.published}>{formatDate(guide.published)}</time>
                        {guide.updated !== guide.published && <> &middot; Updated <time dateTime={guide.updated}>{formatDate(guide.updated)}</time></>}
                    </p>
                    <p className="text-xl text-mi-light/90 leading-relaxed mb-10">{guide.intro}</p>

                    <div className="space-y-10">
                        {guide.sections.map((section) => (
                            <section key={section.heading}>
                                <h2 className="text-2xl font-bold text-white mb-3">{section.heading}</h2>
                                {section.paragraphs.map((text) => <p key={text} className="text-mi-light/90 leading-relaxed mb-3">{text}</p>)}
                                {section.checklist && (
                                    <ul className="mt-4 space-y-2">
                                        {section.checklist.map((item) => (
                                            <li key={item} className="flex items-start gap-3 text-mi-light/90"><Icons.CheckCircle2 size={18} className="text-mi-cyan shrink-0 mt-1" />{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        ))}
                    </div>

                    <div className="mt-14 bg-mi-dark2 border border-mi-cyan/40 rounded-3xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Want this checked for your business?</h2>
                        <p className="text-mi-light/85 mb-6">The Free Quick Look runs these checks for you, based on public information only.</p>
                        <Button onClick={startQuickLook} className="mx-auto">{QUICK_LOOK.cta}</Button>
                        <p className="mt-4 text-sm"><a href="/sample-quick-look" className="text-mi-cyan underline hover:text-white">See a sample Quick Look first</a></p>
                    </div>

                    <section aria-labelledby="related" className="mt-14">
                        <h2 id="related" className="text-xl font-bold text-white mb-4">More guides</h2>
                        <ul className="grid sm:grid-cols-2 gap-4">
                            {related.map((g) => (
                                <li key={g.slug}>
                                    <a href={`/resources/${g.slug}`} className="block h-full bg-mi-dark2 border border-mi-blue/20 hover:border-mi-cyan rounded-2xl p-5 transition-colors">
                                        <p className="text-xs font-bold text-mi-cyan uppercase tracking-widest mb-1">{g.label}</p>
                                        <p className="font-bold text-white">{g.title}</p>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
                </Container>
            </article>
        </Layout>
    );
}

export { GUIDES };
