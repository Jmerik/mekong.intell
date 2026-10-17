// Email through the Resend API (RESEND_API_KEY, MAIL_FROM such as "Mekong Intelligence <quicklook@yourdomain>").
// Plain text only. The sender address must belong to a domain verified with the email provider.
async function sendEmail({ to, subject, text }, { env = process.env, fetchImpl = fetch, timeoutMs = 8000 } = {}) {
    const response = await fetchImpl('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: env.MAIL_FROM, to: [to], subject, text }),
        signal: AbortSignal.timeout(timeoutMs)
    });
    if (!response.ok) throw new Error(`Email provider ${response.status}`);
}

function verificationEmail({ lang, link, targetLabel }) {
    if (lang === 'de') {
        return {
            subject: 'Bitte bestätigen Sie Ihre Quick-Look-Anfrage',
            text: [
                'Guten Tag,', '',
                `jemand (hoffentlich Sie) hat bei Mekong Intelligence einen kostenlosen Quick Look für ${targetLabel} angefordert.`, '',
                'Bitte bestätigen Sie mit diesem Link, dass die Anfrage von Ihnen stammt. Erst danach beginnen wir:', link, '',
                'Der Link ist 24 Stunden gültig und kann einmal verwendet werden.',
                'Wenn die Anfrage nicht von Ihnen stammt, ignorieren Sie diese E-Mail. Dann geschieht nichts.', '',
                'Mekong Intelligence'
            ].join('\n')
        };
    }
    return {
        subject: 'Please confirm your Free Quick Look request',
        text: [
            'Hello,', '',
            `Someone (hopefully you) asked Mekong Intelligence for a Free Quick Look of ${targetLabel}.`, '',
            'Please confirm with this link that the request is yours. We start only after that:', link, '',
            'The link works for 24 hours and can be used once.',
            'If the request was not yours, ignore this email. Nothing will happen.', '',
            'Mekong Intelligence'
        ].join('\n')
    };
}

function reportEmail({ lang, reportText }) {
    return lang === 'de'
        ? { subject: 'Ihr kostenloser Quick Look von Mekong Intelligence', text: `Guten Tag,\n\nhier ist Ihr Quick Look. Er beruht ausschließlich auf öffentlichen Informationen. Der Bericht ist auf Englisch. Antworten Sie gern auf Deutsch.\n\n${reportText}\n\nMekong Intelligence` }
        : { subject: 'Your Free Quick Look from Mekong Intelligence', text: `Hello,\n\nHere is your Quick Look. It is based on public information only. Reply to this email if you would like to talk it through.\n\n${reportText}\n\nMekong Intelligence` };
}

module.exports = { sendEmail, verificationEmail, reportEmail };
