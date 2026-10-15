import { SAMPLE } from '../content/sample.js';
import { SectionHeader, Container, Icons } from './ui.jsx';

// Rating words and colours from the MI brand guide: Strong, Developing, Priority focus.
// "N/A" is used when an area was not assessed. No school grades, no scores.
const PILL = {
    'Strong': 'bg-[#E3F3E8] text-[#1F7A4D]',
    'Developing': 'bg-[#FFF3D9] text-[#8A5A00]',
    'Priority focus': 'bg-[#FDE9E4] text-[#A63A1F]',
    'N/A': 'bg-[#E4E9EE] text-[#4A5560]'
};

export const RatingPill = ({ rating }) => (
    <span className={`inline-block shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${PILL[rating] || PILL['N/A']}`}>{rating}</span>
);

// Compact version for the landing pages: three rows and a link to the full sample.
export function SampleTeaser() {
    return (
        <section id="sample" className="py-14 md:py-20 bg-mi-dark2 border-t border-mi-dark1">
            <Container className="max-w-5xl">
                <SectionHeader label="A real example" title={SAMPLE.headline} subtitle={SAMPLE.summary} />

                <div className="bg-mi-dark1 border border-mi-blue/30 rounded-3xl p-5 md:p-8 shadow-xl">
                    <p className="text-xs md:text-sm text-mi-light/70 mb-4">
                        Quick Look &middot; {SAMPLE.site} &middot; <time dateTime={SAMPLE.isoDate}>{SAMPLE.date}</time> &middot; public information only
                    </p>
                    <ul className="divide-y divide-mi-dark2">
                        {SAMPLE.areas.map((area) => (
                            <li key={area.id} className="py-4 grid gap-2 md:grid-cols-[11rem_9rem_1fr] md:items-center">
                                <div>
                                    <p className="font-bold text-white">{area.name}</p>
                                    <p className="text-xs text-mi-light/70">{area.kind}</p>
                                </div>
                                <div><RatingPill rating={area.rating} /></div>
                                <p className="text-sm text-mi-light/85">{area.basis}</p>
                            </li>
                        ))}
                    </ul>
                    <a href="/sample-quick-look" className="mt-4 inline-flex items-center gap-2 font-bold text-mi-cyan hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mi-cyan rounded">
                        See the full sample, with sources <Icons.ArrowRight size={16} />
                    </a>
                </div>
            </Container>
        </section>
    );
}

const Meta = ({ source, date }) => (
    <p className="mt-2 text-xs text-mi-light/70">Source: {source} &middot; {date}</p>
);

// The full report, shown on /sample-quick-look.
export function SampleReport() {
    return (
        <div className="space-y-10">
            <section aria-label="Summary" className="bg-mi-dark2 border border-mi-cyan/30 rounded-3xl p-6 md:p-8">
                <p className="text-mi-light/90 mb-6">{SAMPLE.summary}</p>
                <div className="grid sm:grid-cols-3 gap-4">
                    {SAMPLE.areas.map((area) => (
                        <div key={area.id} className="bg-mi-dark1 rounded-2xl p-4">
                            <p className="font-bold text-white">{area.name}</p>
                            <div className="my-2"><RatingPill rating={area.rating} /></div>
                            <p className="text-sm text-mi-light/80">{area.basis}</p>
                        </div>
                    ))}
                </div>
            </section>

            {SAMPLE.areas.map((area) => (
                <section key={area.id} id={area.id} aria-labelledby={`h-${area.id}`}>
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h2 id={`h-${area.id}`} className="text-2xl md:text-3xl font-bold text-white">{area.name}</h2>
                        <RatingPill rating={area.rating} />
                    </div>
                    <p className="text-mi-light/70 text-sm mb-5">{area.kind}</p>

                    {area.findings.length > 0 && (
                        <ul className="space-y-4">
                            {area.findings.map((finding) => (
                                <li key={finding.text} className="bg-mi-dark2 border border-mi-blue/20 rounded-2xl p-5">
                                    <p className="text-mi-light/90">{finding.text}</p>
                                    <Meta source={finding.source} date={finding.date} />
                                </li>
                            ))}
                        </ul>
                    )}

                    {area.notAssessed.length > 0 && (
                        <div className="mt-4 rounded-2xl border border-dashed border-mi-light/30 p-5">
                            <p className="text-xs font-bold uppercase tracking-wider text-mi-light/70 mb-2"><RatingPill rating="N/A" /> <span className="ml-2">Not assessed</span></p>
                            <ul className="space-y-1 text-sm text-mi-light/80 list-disc pl-5">
                                {area.notAssessed.map((line) => <li key={line}>{line}</li>)}
                            </ul>
                        </div>
                    )}
                </section>
            ))}

            <section aria-labelledby="h-fixes">
                <h2 id="h-fixes" className="text-2xl md:text-3xl font-bold text-white mb-5">Quick fixes we would start with</h2>
                <ol className="space-y-4">
                    {SAMPLE.fixes.map((fix, i) => (
                        <li key={fix.name} className="flex gap-4 bg-mi-dark2 border border-mi-blue/20 rounded-2xl p-5">
                            <span className="w-9 h-9 shrink-0 rounded-full border-2 border-mi-cyan text-mi-cyan font-bold flex items-center justify-center" aria-hidden="true">{i + 1}</span>
                            <div>
                                <h3 className="font-bold text-white">{fix.name}</h3>
                                <p className="text-sm text-mi-light/85 mt-1">{fix.detail}</p>
                                <p className="text-xs font-bold text-mi-cyan mt-2">Effort: {fix.effort}</p>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            <section aria-labelledby="h-method" className="rounded-2xl bg-mi-dark2/60 border border-mi-blue/20 p-5 text-sm text-mi-light/80">
                <h2 id="h-method" className="font-bold text-white mb-2">How this was checked</h2>
                <p>{SAMPLE.method} Only public information was reviewed. Anything we could not verify is marked N/A. Prepared by Mekong Intelligence on <time dateTime={SAMPLE.isoDate}>{SAMPLE.date}</time>.</p>
            </section>
        </div>
    );
}
