import { RHYTHM } from '../content/site.js';
import { Container } from './ui.jsx';

// Orbit diagram: Mekong Intelligence in the centre, five steps on a ring.
// Layout idea from the Axy.digital reference, drawn in MI colours. No inline styles (the CSP forbids them).
const CX = 320;
const CY = 260;
const R = 200;
const ANGLES = [-90, -18, 54, 126, 198];

const nodes = RHYTHM.map((step, i) => {
    const angle = (ANGLES[i] * Math.PI) / 180;
    return { ...step, n: i + 1, x: Math.round(CX + R * Math.cos(angle)), y: Math.round(CY + R * Math.sin(angle)) };
});

function Orbit() {
    return (
        <svg viewBox="0 0 640 520" role="img" aria-label="The Mekong Intelligence rhythm: Look, Fix, Count, Blueprint, Retainer" className="hidden md:block w-full max-w-[560px] mx-auto">
            <defs>
                <radialGradient id="rhythm-core" cx="35%" cy="30%" r="80%">
                    <stop offset="0" stopColor="#50c6e9" />
                    <stop offset="1" stopColor="#4a7ea9" />
                </radialGradient>
                <radialGradient id="rhythm-glow">
                    <stop offset="0" stopColor="#50c6e9" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#50c6e9" stopOpacity="0" />
                </radialGradient>
            </defs>

            <circle cx={CX} cy={CY} r="130" fill="url(#rhythm-glow)" />
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#4a7ea9" strokeOpacity="0.6" strokeWidth="1.5" />
            <circle cx={CX} cy={CY} r={R - 28} fill="none" stroke="#4a7ea9" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="3 7" />

            <g className="orbit-spin">
                <circle cx={CX + R} cy={CY} r="13" fill="#50c6e9" fillOpacity="0.25" />
                <circle cx={CX + R} cy={CY} r="6" fill="#50c6e9" />
            </g>

            {nodes.map((node) => (
                <g key={node.label}>
                    <rect x={node.x - 76} y={node.y - 25} width="152" height="50" rx="25" fill="#374455" stroke="#4a7ea9" strokeOpacity="0.6" />
                    <circle cx={node.x - 50} cy={node.y} r="15" fill="#202a3a" stroke="#50c6e9" />
                    <text x={node.x - 50} y={node.y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#50c6e9">{node.n}</text>
                    <text x={node.x - 26} y={node.y + 6} fontSize="17" fontWeight="600" fill="#ffffff">{node.label}</text>
                </g>
            ))}

            <circle cx={CX} cy={CY} r="68" fill="url(#rhythm-core)" />
            <text x={CX} y={CY - 2} textAnchor="middle" fontSize="13" fontWeight="800" letterSpacing="2" fill="#202a3a">MEKONG</text>
            <text x={CX} y={CY + 15} textAnchor="middle" fontSize="10.5" fontWeight="800" letterSpacing="1.2" fill="#202a3a">INTELLIGENCE</text>
        </svg>
    );
}

export default function Rhythm() {
    return (
        <section id="rhythm" className="py-20 bg-mi-dark2 border-t border-mi-dark1">
            <Container>
                <div className="text-center mb-12">
                    <p className="text-mi-cyan text-sm font-bold tracking-widest uppercase mb-3">The Mekong Intelligence Rhythm</p>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Look. Fix. Count.</h2>
                    <div className="h-1 w-24 bg-mi-cyan mx-auto"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
                    <Orbit />
                    <ol className="space-y-4">
                        {nodes.map((node) => (
                            <li key={node.label} className="flex items-start gap-4 bg-mi-dark1 border border-mi-blue/20 rounded-2xl p-5">
                                <span className="w-9 h-9 shrink-0 rounded-full border border-mi-cyan text-mi-cyan font-bold flex items-center justify-center" aria-hidden="true">{node.n}</span>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{node.label}</h3>
                                    <p className="text-mi-light/80">{node.text}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </Container>
        </section>
    );
}
