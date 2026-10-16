import { useRef, useState } from 'react';
import { HERO, FACTS, SITE } from '../content/site.js';
import { AUDIENCE_LIST } from '../content/audiences.js';
import { Icons, Button, Container } from './ui.jsx';
import { FoundMock, TrustedMock, ReachedMock } from './mocks.jsx';
import { useModal } from './Layout.jsx';

// The main call to action: type a website or company name, then leave contact details in the form.
// SCANNER PLACEHOLDER: today this opens the Quick Look request form. When the scanner is live,
// this is where the instant analysis should start (see api/_lib/scanner.js).
export function QuickLookPill() {
    const { openModal } = useModal();
    const inputRef = useRef(null);
    const [value, setValue] = useState('');
    const [missing, setMissing] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        if (!value.trim()) {
            setMissing(true);
            if (inputRef.current) inputRef.current.focus();
            return;
        }
        setMissing(false);
        openModal({ packageType: 'quicklook', website: value.trim() });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <form role="search" onSubmit={submit} className="rounded-2xl p-2 bg-mi-dark2/80 border border-mi-cyan/30 shadow-[0_0_60px_rgba(80,198,233,0.18)] flex flex-col sm:flex-row gap-2 focus-within:border-mi-cyan transition-colors">
                <label htmlFor="ql-target" className="sr-only">Website or company name</label>
                <div className="flex-1 flex items-center gap-3 bg-mi-dark1 rounded-xl px-4">
                    <Icons.Search size={20} className="text-mi-cyan shrink-0" />
                    <input
                        ref={inputRef}
                        id="ql-target"
                        type="text"
                        maxLength={300}
                        autoComplete="off"
                        placeholder={HERO.placeholder}
                        aria-describedby={missing ? 'ql-error' : 'ql-note'}
                        aria-invalid={missing}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full bg-transparent py-4 text-white placeholder:text-mi-light/60 focus:outline-none"
                    />
                </div>
                <Button type="submit" className="py-4 px-6 whitespace-nowrap">{HERO.button}</Button>
            </form>
            {missing ? (
                <p id="ql-error" role="alert" className="mt-3 text-sm text-red-300">Please enter your website or company name.</p>
            ) : (
                <p id="ql-note" className="mt-3 text-sm text-mi-light/80">{SITE.scannerEnabled ? HERO.note.live : HERO.note.manual}</p>
            )}
        </div>
    );
}

// Local | International switch shown on the two landing pages.
function AudienceSwitch({ current }) {
    return (
        <nav aria-label="Choose your audience" className="inline-flex p-1 mb-8 rounded-full bg-mi-dark2 border border-mi-blue/30">
            {AUDIENCE_LIST.map((a) => (
                <a key={a.id} href={a.path} aria-current={a.id === current ? 'page' : undefined}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${a.id === current ? 'bg-mi-cyan text-mi-dark1' : 'text-mi-light/80 hover:text-white'}`}>
                    {a.switchLabel}
                </a>
            ))}
        </nav>
    );
}

export function Facts() {
    return (
        <dl className="mt-10 md:mt-14 grid grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto">
            {FACTS.map((fact) => (
                <div key={fact.label} className="flex flex-col-reverse items-center">
                    <dt className="text-xs sm:text-sm text-mi-light/80 text-center">{fact.label}</dt>
                    <dd className="text-2xl sm:text-3xl font-bold text-white">{fact.value}</dd>
                </div>
            ))}
        </dl>
    );
}

// Product previews that peek up under the search bar (desktop only). Decorative: the same example screens
// appear in full, with captions, in the Found / Trusted / Reached section below, so they are hidden from
// screen readers here and fade out at the bottom.
function HeroPreview({ audience }) {
    return (
        <div aria-hidden="true" className="hidden lg:block relative mt-14 h-72 overflow-hidden pointer-events-none select-none [mask-image:linear-gradient(to_bottom,black_45%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_45%,transparent_100%)]">
            <div className="absolute inset-x-0 top-0 mx-auto grid grid-cols-3 items-start gap-6 max-w-5xl text-left">
                <div className="mt-8 -rotate-2 scale-95 opacity-70 origin-bottom-right"><TrustedMock data={audience.trusted} /></div>
                <div className="relative z-10 shadow-[0_0_80px_rgba(80,198,233,0.25)] rounded-2xl"><FoundMock data={audience.found} /></div>
                <div className="mt-8 rotate-2 scale-95 opacity-70 origin-bottom-left"><ReachedMock data={audience.reached} /></div>
            </div>
        </div>
    );
}

// `audience` is an entry from content/audiences.js (the main page uses "local").
export default function Hero({ audience, children }) {
    return (
        <header className="relative overflow-hidden bg-mi-dark1 pt-12 pb-12 md:pt-20 md:pb-24">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-mi-blue/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" aria-hidden="true"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-mi-cyan/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" aria-hidden="true"></div>

            <Container className="relative z-10 text-center max-w-5xl">
                <AudienceSwitch current={audience.id} />
                <p className="block w-fit mx-auto px-4 py-1 bg-mi-dark2 border border-mi-blue/30 rounded-full text-mi-cyan text-xs sm:text-sm font-semibold tracking-wide mb-6 animate-fade-in-up">
                    {HERO.tagline}
                </p>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 text-white">
                    {HERO.headline.map((line, i) => (
                        <span key={line} className={`block ${i === HERO.headlineAccentLine ? 'bg-clip-text text-transparent bg-gradient-to-r from-mi-cyan via-mi-blue to-mi-light' : ''}`}>{line}{i < HERO.headline.length - 1 ? ' ' : ''}</span>
                    ))}
                </h1>
                <p className="text-xl md:text-2xl font-semibold text-white mb-3">{HERO.subheadline}</p>
                <p className="text-lg text-mi-light/85 mb-10 max-w-2xl mx-auto">{audience.line}</p>

                <QuickLookPill />
                {children}
                <Facts />
            </Container>
            <Container className="relative z-0 max-w-5xl">
                <HeroPreview audience={audience} />
            </Container>
        </header>
    );
}
