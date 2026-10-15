import { useState, useEffect, useRef } from 'react';
import { SITE, QUICK_LOOK } from '../content/site.js';
import LeadForm, { requestTitle } from './LeadForm.jsx';
import { Button, Icons } from './ui.jsx';

// Mounted only while open, so every opening starts on a fresh, empty form.
export default function BookingModal({ request, audience, onClose }) {
    const { packageType, website = '', focus = '' } = request;
    const [done, setDone] = useState(null);
    const dialogRef = useRef(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    const title = requestTitle(packageType);
    const isQuickLook = packageType === 'quicklook';

    // Focus the first field, close on Escape, keep Tab inside the dialog, lock background scroll.
    useEffect(() => {
        const previouslyFocused = document.activeElement;
        const dialog = dialogRef.current;
        const focusables = () => dialog.querySelectorAll('button, [href], input:not([tabindex="-1"]), select, textarea');
        const firstField = dialog.querySelector('input:not([tabindex="-1"]), select, textarea') || focusables()[0];
        if (firstField) firstField.focus();

        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                onCloseRef.current();
            } else if (e.key === 'Tab') {
                const items = focusables();
                const first = items[0];
                const last = items[items.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        document.addEventListener('keydown', onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
            if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 bg-mi-dark1/90 backdrop-blur-sm overflow-y-auto" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="booking-title" className="bg-mi-dark2 border border-mi-blue/30 rounded-2xl w-full max-w-lg shadow-2xl relative animate-fade-in-up my-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-mi-light/70 hover:text-white transition-colors" aria-label="Close form">
                    <Icons.X size={24} />
                </button>

                <div className="p-6 sm:p-8">
                    {!done ? (
                        <>
                            <h2 id="booking-title" className="text-2xl font-bold text-white mb-2 pr-8">{title}</h2>
                            <p className="text-mi-light/80 mb-6 text-sm">
                                {isQuickLook
                                    ? `Tell us where to look and where to send the result. Free, delivered ${QUICK_LOOK.delivery}, based on public information only. No credit card required.`
                                    : 'Fill out the details below. We typically respond within 2 hours on Telegram, or by phone or email if you prefer.'}
                            </p>
                            <LeadForm packageType={packageType} audience={audience} focus={focus} initialWebsite={website} idPrefix="m" onSuccess={setDone} />
                        </>
                    ) : (
                        <div className="text-center py-10" role="status">
                            <div className="w-16 h-16 bg-mi-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6 text-mi-cyan">
                                <Icons.CheckCircle2 size={32} />
                            </div>
                            <h2 id="booking-title" className="text-2xl font-bold text-white mb-4">Request received</h2>
                            {isQuickLook ? (
                                <p className="text-mi-light/80 mb-8">
                                    {SITE.scannerEnabled
                                        ? <>Your Quick Look for <span className="text-mi-cyan font-bold">{done.website}</span> is being prepared. We will send it to {done.email}.</>
                                        : <>Thanks. We will prepare your Quick Look for <span className="text-mi-cyan font-bold">{done.website}</span> and send it to {done.email} {QUICK_LOOK.delivery}. It is based on public information only.</>}
                                </p>
                            ) : (
                                <p className="text-mi-light/80 mb-8">
                                    Thanks. We have received your request: <span className="text-mi-cyan font-bold">{title}</span>. We will be in touch shortly.
                                </p>
                            )}
                            <Button variant="secondary" onClick={onClose} className="mx-auto">Close</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
