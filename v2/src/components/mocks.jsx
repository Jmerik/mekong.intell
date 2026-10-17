// Mock product screens for the Found / Trusted / Reached cards.
// They are illustrations built from HTML, not client data, and every one says "Example".
// Status chips use cyan and slate on purpose: the MI voice avoids red/green scoring.

import { Icons } from './ui.jsx';
import { useModal } from './Layout.jsx';

// Fixed words inside the example screens, per page language.
const TEXT = {
    en: { example: 'Example', aiAnswer: 'AI answer', foundAria: 'Example: how a brand appears in an AI answer, before and after', before: 'Before', after: 'After', brand: 'Your brand', notMentioned: 'NOT MENTIONED', recommended: 'RECOMMENDED', storefront: 'Digital storefront', trustedAria: 'Example: a complete business profile with reviews', complete: 'Complete', inbox: 'Inbox', reachedAria: 'Example: first reply time dropping to instant', firstReply: 'First reply time', autoReply: 'Automatic first reply', autoText: 'Thanks for your message. We will reply shortly.', buttonsAria: 'Example contact buttons' },
    de: { example: 'Beispiel', aiAnswer: 'KI-Antwort', foundAria: 'Beispiel: wie eine Marke in einer KI-Antwort erscheint, vorher und nachher', before: 'Vorher', after: 'Nachher', brand: 'Ihre Marke', notMentioned: 'NICHT GENANNT', recommended: 'EMPFOHLEN', storefront: 'Digitaler Auftritt', trustedAria: 'Beispiel: ein vollständiges Unternehmensprofil mit Bewertungen', complete: 'Vollständig', inbox: 'Posteingang', reachedAria: 'Beispiel: die Zeit bis zur ersten Antwort sinkt auf sofort', firstReply: 'Zeit bis zur ersten Antwort', autoReply: 'Automatische Erstantwort', autoText: 'Danke für Ihre Nachricht. Wir antworten in Kürze.', buttonsAria: 'Beispiel für Kontakt-Buttons' }
};
const useText = () => TEXT[useModal().lang] || TEXT.en;

const ExampleTag = () => (
    <span className="text-[10px] font-bold uppercase tracking-wider text-mi-cyan border border-mi-cyan/40 rounded px-2 py-0.5">{useText().example}</span>
);

const Panel = ({ label, children, ariaLabel }) => (
    <div role="group" aria-label={ariaLabel} className="rounded-2xl bg-mi-dark1 border border-mi-blue/30 p-4 md:p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3 md:mb-4">
            <span className="text-xs font-bold tracking-widest text-mi-light/70 uppercase">{label}</span>
            <ExampleTag />
        </div>
        {children}
    </div>
);

const Chip = ({ muted, children }) => (
    <span className={`shrink-0 text-[11px] font-bold tracking-wider px-2 py-1 rounded ${muted ? 'border border-mi-light/30 text-mi-light/80' : 'bg-mi-cyan text-mi-dark1'}`}>{children}</span>
);

const Row = ({ children, highlight, dashed }) => (
    <li className={`flex items-center justify-between gap-3 rounded-lg px-3 py-1.5 md:py-2 text-sm ${highlight ? 'bg-mi-cyan/10 border border-mi-cyan/50 text-white' : dashed ? 'border border-dashed border-mi-light/30 text-mi-light/80' : 'bg-mi-dark2 text-mi-light/90'}`}>
        {children}
    </li>
);

export function FoundMock({ data }) {
    const t = useText();
    return (
        <Panel label={t.aiAnswer} ariaLabel={t.foundAria}>
            <div className="flex items-center gap-2 rounded-lg bg-mi-dark2 px-3 py-2 text-sm text-white mb-3 md:mb-4">
                <Icons.Search size={16} className="text-mi-cyan shrink-0" />
                <span>{data.prompt}</span>
            </div>

            <p className="text-xs uppercase tracking-wider text-mi-light/70 mb-2">{t.before}</p>
            <ul className="space-y-2">
                {data.others.map((name) => <Row key={name}>{name}</Row>)}
                <Row dashed><span>{t.brand}</span><Chip muted>{t.notMentioned}</Chip></Row>
            </ul>

            <div className="flex justify-center my-2 text-mi-cyan"><Icons.ArrowDown size={20} /></div>

            <p className="text-xs uppercase tracking-wider text-mi-light/70 mb-2">{t.after}</p>
            <ul className="space-y-2">
                <Row highlight><span className="font-bold">{t.brand}</span><Chip>{t.recommended}</Chip></Row>
                {data.others.map((name) => <Row key={name}>{name}</Row>)}
            </ul>
        </Panel>
    );
}

export function TrustedMock({ data }) {
    const t = useText();
    return (
        <Panel label={t.storefront} ariaLabel={t.trustedAria}>
            <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-full bg-mi-cyan/20 text-mi-cyan flex items-center justify-center shrink-0"><Icons.MapPin size={20} /></span>
                <div>
                    <p className="text-white font-bold leading-tight">{data.business}</p>
                    <p className="text-xs text-mi-light/70">{data.area}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 mb-5">
                <span className="flex text-mi-cyan" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((i) => <Icons.Star key={i} size={16} className="fill-current" />)}
                </span>
                <span className="text-white font-bold">{data.rating}</span>
                <span className="text-sm text-mi-light/70">{data.reviews}</span>
            </div>
            <ul className="space-y-2">
                {data.checks.map((item) => (
                    <Row key={item}>
                        <span className="flex items-center gap-2"><Icons.Check size={16} className="text-mi-cyan shrink-0" />{item}</span>
                        <Chip muted>{t.complete}</Chip>
                    </Row>
                ))}
            </ul>
        </Panel>
    );
}

export function ReachedMock({ data }) {
    const t = useText();
    return (
        <Panel label={t.inbox} ariaLabel={t.reachedAria}>
            <p className="text-sm text-mi-light/80 mb-2">{t.firstReply}</p>
            <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl font-bold text-mi-light/60 line-through decoration-1">{data.before}</span>
                <Icons.ArrowRight size={22} className="text-mi-cyan shrink-0" />
                <span className="text-3xl font-extrabold text-mi-cyan">{data.after}</span>
            </div>

            <div className="rounded-xl bg-mi-dark2 px-4 py-3 text-sm text-mi-light/90 mb-5">
                <p className="text-xs uppercase tracking-wider text-mi-light/70 mb-1">{t.autoReply}</p>
                {t.autoText}
            </div>

            <ul className="flex flex-wrap gap-2" aria-label={t.buttonsAria}>
                {data.channels.map((name) => (
                    <li key={name} className="flex items-center gap-2 rounded-lg border-2 border-mi-cyan/60 px-3 py-2 text-sm font-bold text-mi-cyan">
                        {name === 'Email' ? <Icons.Mail size={16} /> : name === 'Telegram' ? <Icons.Send size={16} /> : name === 'LinkedIn' ? <Icons.Linkedin size={16} /> : <Icons.Message size={16} />}
                        {name}
                    </li>
                ))}
            </ul>
        </Panel>
    );
}
