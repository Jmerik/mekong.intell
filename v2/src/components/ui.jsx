// Small shared building blocks: icons, buttons, section headers.

const Icon = ({ path, size = 24, className = '' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
        {path}
    </svg>
);

export const Icons = {
    Menu: (p) => <Icon {...p} path={<><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></>} />,
    X: (p) => <Icon {...p} path={<><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>} />,
    ArrowRight: (p) => <Icon {...p} path={<><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>} />,
    ArrowDown: (p) => <Icon {...p} path={<><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></>} />,
    Check: (p) => <Icon {...p} path={<path d="M20 6 9 17l-5-5"/>} />,
    CheckCircle2: (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></>} />,
    Search: (p) => <Icon {...p} path={<><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>} />,
    MapPin: (p) => <Icon {...p} path={<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>} />,
    Star: (p) => <Icon {...p} path={<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>} />,
    Message: (p) => <Icon {...p} path={<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>} />,
    Mail: (p) => <Icon {...p} path={<><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 6L2 7"/></>} />,
    Send: (p) => <Icon {...p} path={<><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>} />,
    Linkedin: (p) => <Icon {...p} path={<><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></>} />,
    Database: (p) => <Icon {...p} path={<><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></>} />
};

const BASE = 'px-6 py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mi-cyan';
const VARIANTS = {
    primary: 'bg-gradient-to-r from-mi-blue to-mi-cyan hover:opacity-90 text-mi-dark1 shadow-lg shadow-mi-cyan/20',
    secondary: 'bg-mi-dark2 border border-mi-blue/40 hover:border-mi-cyan text-mi-light hover:text-white',
    outline: 'border-2 border-mi-cyan text-mi-cyan hover:bg-mi-cyan/10'
};

// Renders a link when `href` is given, otherwise a button.
export const Button = ({ children, variant = 'primary', className = '', onClick, type = 'button', disabled = false, href }) => {
    const motion = disabled ? 'opacity-50 cursor-not-allowed' : 'motion-safe:hover:-translate-y-0.5 cursor-pointer';
    const classes = `${BASE} ${VARIANTS[variant]} ${motion} ${className}`;
    if (href) {
        return <a href={href} className={classes}>{children}</a>;
    }
    return <button type={type} onClick={onClick} disabled={disabled} className={classes}>{children}</button>;
};

export const SectionHeader = ({ label, title, subtitle, centered = true, as: Tag = 'h2' }) => (
    <div className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}>
        {label && <p className="text-mi-cyan text-sm font-bold tracking-widest uppercase mb-3">{label}</p>}
        <Tag className="text-3xl md:text-5xl font-bold text-white mb-4">{title}</Tag>
        <div className={`h-1 w-24 bg-mi-cyan mb-6 ${centered ? 'mx-auto' : ''}`}></div>
        {subtitle && <p className={`text-mi-light/80 text-lg max-w-2xl leading-relaxed ${centered ? 'mx-auto' : ''}`}>{subtitle}</p>}
    </div>
);

export const Container = ({ children, className = '' }) => (
    <div className={`container mx-auto px-6 ${className}`}>{children}</div>
);
