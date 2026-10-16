// German landing page (/de) and the German parts of the shared interface (form, dialog, nav, footer, cookie banner).
// Audience: companies from Germany, Austria and Switzerland that buy, invest or expand in Cambodia and Vietnam,
// and regional companies that sell to German-speaking buyers.
// Voice: formal "Sie", plain short sentences, evidence only, no crisis language. Write " - " instead of dashes.
// Product names stay as in English (7-Day Sprint, 90-Day Blueprint, ...) so they match the proposals and messages.

export const DE_DELIVERY = 'innerhalb von 2 Werktagen';
export const DE_REPLY = 'innerhalb von 1 Werktag';

export const DE = {
    banner: 'Vorschau. Der Quick-Look-Scanner ist noch nicht angebunden.',
    tagline: 'Schluss mit Raten. Wachsen mit Daten.',

    hero: {
        label: 'Website oder Firmenname',
        headline: ['Marken- und', 'Marktintelligenz', 'für Südostasien.'],
        accentLine: 1,
        subheadline: 'Prüfen. Beheben. Nachzählen.',
        line: 'Für Unternehmen aus Deutschland, Österreich und der Schweiz, die in Kambodscha und Vietnam einkaufen, investieren oder expandieren.',
        placeholder: 'Ihre Website oder Ihr Firmenname',
        button: 'Kostenlosen Quick Look anfordern',
        missing: 'Bitte geben Sie Ihre Website oder Ihren Firmennamen ein.',
        note: `Eine kostenlose erste Einschätzung, ob Ihr Unternehmen gefunden wird, vertrauenswürdig wirkt und erreichbar ist. Zustellung ${DE_DELIVERY}, ausschließlich auf Basis öffentlicher Informationen. Keine Kreditkarte nötig.`
    },

    facts: [
        { value: 'Kostenlos', label: 'Quick Look' },
        { value: '7 Tage', label: '3 Maßnahmen live' },
        { value: 'Tag 35', label: 'Zahlen neu gezählt' }
    ],

    trust: [
        'Nur öffentliche Informationen',
        'Jede Feststellung mit Quelle und Datum',
        'Direkter Draht zu Vosumtey Seng, Founder'
    ],

    checks: {
        label: 'Was der Quick Look prüft',
        title: 'Gefunden. Vertraut. Erreicht.',
        subtitle: 'Drei Prüfungen, die darüber entscheiden, ob ein Geschäftspartner sich überhaupt bei Ihnen meldet.',
        items: [
            {
                id: 'found', name: 'Gefunden', kind: 'KI- und Suchsichtbarkeit', headline: 'In der KI-Ära gefunden werden.', cta: 'KI-Sichtbarkeit testen',
                body: 'Wenn Einkäufer und Partner bei Google oder LinkedIn recherchieren oder KI-Suchen wie ChatGPT und Claude fragen: Taucht Ihr Unternehmen auf - oder empfiehlt die KI Ihre Wettbewerber?'
            },
            {
                id: 'trusted', name: 'Vertraut', kind: 'Belege und digitaler Auftritt', headline: 'Echt wirken. Sofort Vertrauen schaffen.', cta: 'Digitalen Auftritt prüfen',
                body: 'Geschäftspartner prüfen Sie, bevor sie schreiben. Wirken Sie etabliert und nachprüfbar? Fehlende Firmenangaben, dünne Profile oder fehlende Referenzen können das Gespräch beenden, bevor es beginnt.'
            },
            {
                id: 'reached', name: 'Erreicht', kind: 'Kontakt und Anfragen', headline: 'Aus Besuchen werden Gespräche.', cta: 'Kontaktwege prüfen',
                body: 'Kann ein Interessent Sie in einem Schritt erreichen, per E-Mail, LinkedIn, WhatsApp oder Telegram? Wir richten klare Kontaktwege, automatische Erstantworten und ein Anfragenprotokoll ein, damit keine Anfrage verloren geht.'
            }
        ]
    },

    who: {
        label: 'Für wen',
        title: 'Drei typische Ausgangslagen',
        items: [
            {
                title: 'Sie expandieren in die Region',
                body: 'Sie prüfen den Eintritt in Kambodscha oder Vietnam. Der Market Entry Brief ordnet Positionierung, Wettbewerb und öffentlich verfügbare Rahmenbedingungen für Sie ein.'
            },
            {
                title: 'Sie sind bereits vor Ort',
                body: 'Sie haben eine Niederlassung, einen Partner oder einen Vertrieb in der Region. Wir prüfen, ob Käufer vor Ort und in KI-Antworten Ihre Marke finden und ihr vertrauen.'
            },
            {
                title: 'Sie verkaufen von dort nach DACH',
                body: 'Sie produzieren oder liefern aus der Region an deutschsprachige Käufer. Wir prüfen, wie Ihr Unternehmen für diese Käufer auftritt, und wo Angaben oder Referenzen fehlen.'
            }
        ]
    },

    services: {
        label: 'So arbeiten wir',
        title: 'Von der ersten Einschätzung zum laufenden Betrieb',
        subtitle: 'Jede Zusammenarbeit beginnt mit dem kostenlosen Quick Look. Danach entscheiden Sie.',
        quote: 'Umfang und Preis besprechen wir nach Ihrem Quick Look.',
        steps: [
            {
                step: 'Schritt 1', package: 'quicklook', name: 'Free Quick Look', when: 'Tag 0', promise: 'Wo Sie gefunden werden, vertraut wird und erreichbar sind',
                description: 'Eine kostenlose erste Einschätzung Ihres öffentlichen Auftritts auf Google, LinkedIn, in KI-Assistenten und auf Ihrer Website.',
                includes: ['Prüfung von Gefunden, Vertraut und Erreicht', 'Nur öffentliche Informationen', 'Nicht Überprüfbares wird mit N/A markiert', `Zustellung per E-Mail ${DE_DELIVERY}`],
                cta: 'Kostenlosen Quick Look anfordern'
            },
            {
                step: 'Schritt 2', package: 'sprint', name: '7-Day Sprint', when: 'Tag 1 bis 7', promise: '3 Maßnahmen live in 7 Tagen',
                description: 'Festes Paket mit drei Maßnahmen aus Ihrem Quick Look, zum Beispiel ein vollständiges LinkedIn-Profil, klare Kontaktwege oder ein KI-lesbares Unternehmensprofil.',
                includes: ['Analyse Ihres Kernprozesses, dann 3 wirkungsvolle Maßnahmen', 'Live in 7 Tagen'],
                cta: 'Den 7-Day Sprint anfragen'
            },
            {
                step: 'Schritt 3', package: 'blueprint', name: '90-Day Blueprint', when: '90 Tage', promise: 'Fahrplan und Neuzählung an Tag 35',
                description: 'Ein datenbasierter Wachstumsfahrplan für grenzüberschreitende Käufer: Wettbewerbsvergleich im Zielmarkt, KI-Sichtbarkeit und Wege zur Anfrage.',
                includes: ['Wettbewerbsvergleich', 'Strategie für KI-Sichtbarkeit (GEO/AEO)', 'Optimierung des Anfrageweges', 'Technischer Fahrplan für 90 Tage', 'Neuzählung der Ausgangszahlen an Tag 35'],
                cta: 'Den 90-Day Blueprint besprechen'
            },
            {
                step: 'Schritt 4', package: 'retainer', name: 'Market Intelligence Retainer', when: 'Monatlich', promise: 'Wöchentliche Marktupdates', badge: 'Laufend',
                description: 'Fortlaufende Beobachtung von Wettbewerbern und KI-Sichtbarkeit in Ihrem Heimat- und Zielmarkt.',
                includes: ['Monatliche Wachstumsbesprechung', 'Hinweise auf Wettbewerberbewegungen', 'Beobachtung der KI-Sichtbarkeit', 'Wöchentlicher Impact Brief', 'Market Intelligence Dashboard'],
                cta: 'Zum Retainer beraten lassen'
            }
        ],
        entry: {
            package: 'entry', name: 'Market Entry Brief', badge: 'Für Markteintritt und Expansion',
            description: 'Für Unternehmen, die in die Region eintreten oder aus ihr heraus expandieren: individuelle Positionierung, Recherche zu regulatorischen Rahmenbedingungen und eine Karte des Wettbewerbs.',
            includes: ['Fahrplan für den regionalen Markteintritt', 'Lückenanalyse zu lokalen Wettbewerbern', 'Karte des grenzüberschreitenden digitalen Auftritts'],
            disclaimer: 'Die Recherche beruht auf öffentlichen Informationen. Sie ist allgemeine Information, keine Rechtsberatung.',
            cta: 'Den Market Entry Brief anfragen'
        }
    },

    faq: {
        label: 'Fragen',
        title: 'Gut zu wissen',
        items: [
            {
                question: 'Was ist der kostenlose Quick Look?',
                answer: `Eine kostenlose erste Einschätzung, ob Ihr Unternehmen gefunden wird, vertrauenswürdig wirkt und erreichbar ist. Sie nennen uns eine Website oder einen Firmennamen und eine E-Mail-Adresse. Wir senden Ihnen ${DE_DELIVERY} eine kurze Zusammenfassung mit Quellenangaben.`
            },
            {
                question: 'Was bedeuten Gefunden, Vertraut und Erreicht?',
                answer: 'Gefunden: Zeigen Google, Karten und KI-Assistenten Ihr Unternehmen, wenn Käufer fragen? Vertraut: Wirken Ihre Profile, Bewertungen und Angaben aktiv und verlässlich? Erreicht: Kann ein Interessent Sie in einem Schritt kontaktieren und schnell eine Antwort erhalten?'
            },
            {
                question: 'Brauchen Sie Zugriff auf meine Konten oder Website?',
                answer: 'Nein. Der Quick Look beruht ausschließlich auf öffentlichen Informationen, also auf dem, was jeder sehen kann. Jede Feststellung nennt Quelle und Datum. Was wir nicht überprüfen können, markieren wir mit N/A.'
            },
            {
                question: 'In welcher Sprache erhalte ich den Quick Look?',
                answer: 'Auf Deutsch oder Englisch, wie Sie es wünschen. Nennen Sie uns Ihre Wahl in der Nachricht.'
            },
            {
                question: 'Ist der Quick Look wirklich kostenlos?',
                answer: 'Ja. Er ist kostenlos und braucht keine Kreditkarte. Wenn Sie weitergehen möchten, folgen der 7-Day Sprint, der 90-Day Blueprint und der Market Intelligence Retainer. Umfang und Preis besprechen wir nach Ihrem Quick Look.'
            },
            {
                question: 'Wer ist meine Ansprechperson?',
                answer: 'Ihre Ansprechperson ist Vosumtey Seng, Founder & Chief Strategist, nicht ein Junior-Account-Manager.'
            }
        ]
    },

    nav: [
        { label: 'Start', href: '/de' },
        { label: 'Leistungen', href: '/de#leistungen' },
        { label: 'Fragen', href: '/de#fragen' }
    ],
    language: { label: 'English', href: '/international', aria: 'Switch to English' },
    callLabel: 'Strategiegespräch buchen',
    quickLookNav: 'Kostenloser Quick Look',

    footer: {
        headline: 'Jede Zusammenarbeit beginnt mit dem kostenlosen Quick Look.',
        body: 'Wir zeigen Ihnen, wo Sie gefunden werden, vertraut wird und Sie erreichbar sind, und wo Sie zuerst ansetzen sollten. Danach entscheiden Sie, wie tief Sie gehen.',
        about: 'Marken- und Marktintelligenz für Unternehmen in Kambodscha und Vietnam. Sitz: Phnom Penh, Kambodscha.',
        publicOnly: 'Der Quick Look beruht auf öffentlichen Informationen.',
        explore: 'Entdecken',
        company: 'Unternehmen',
        english: 'English version',
        privacy: 'Datenschutz',
        imprint: 'Impressum',
        rights: 'Alle Rechte vorbehalten.',
        cookies: 'Cookie-Einstellungen'
    },

    consent: {
        label: 'Cookie-Zustimmung',
        text: 'Wir möchten Google Analytics nutzen, um zu sehen, welche Seiten hilfreich sind. Cookies werden nur gesetzt, wenn Sie zustimmen.',
        more: 'Mehr erfahren',
        accept: 'Zustimmen',
        decline: 'Ablehnen'
    }
};

// Interface strings shared by the booking dialog and the form, in both languages.
export const FORM_TEXT = {
    en: null,
    de: {
        titles: {
            quicklook: 'Kostenlosen Quick Look anfordern',
            sprint: 'Anfrage zum 7-Day Sprint',
            blueprint: 'Anfrage zum 90-Day Blueprint',
            retainer: 'Anfrage zum Market Intelligence Retainer',
            entry: 'Anfrage zum Market Entry Brief',
            call: 'Strategiegespräch buchen',
            contact: 'Nachricht senden'
        },
        quicklookIntro: `Sagen Sie uns, wo wir suchen sollen und wohin wir das Ergebnis senden. Kostenlos, ${DE_DELIVERY} zugestellt, ausschließlich auf Basis öffentlicher Informationen. Keine Kreditkarte nötig.`,
        otherIntro: `Füllen Sie die Angaben aus. Wir antworten ${DE_REPLY}.`,
        closeForm: 'Formular schließen',
        close: 'Schließen',
        received: 'Anfrage erhalten',
        quicklookDone: (website, email) => [`Danke. Wir erstellen Ihren Quick Look für `, website, ` und senden ihn ${DE_DELIVERY} an ${email}. Er beruht ausschließlich auf öffentlichen Informationen.`],
        otherDone: (title) => [`Danke. Ihre Anfrage ist bei uns eingegangen: `, title, `. Wir melden uns in Kürze.`],
        name: 'Name', namePlaceholder: 'Ihr vollständiger Name', optional: ' (optional)',
        website: 'Website oder Firmenname',
        email: 'E-Mail', emailPlaceholder: 'name@firma.de',
        telegram: 'Telegram-Benutzername', phone: 'Telefon / WhatsApp',
        legend: 'Schnellere Wege, Sie zu erreichen',
        hint: 'Wir antworten per E-Mail. Nennen Sie Telegram oder eine Telefonnummer, wenn Sie dort eine schnellere Antwort bevorzugen.',
        details: 'Name oder einen schnelleren Kontaktweg ergänzen (optional)',
        message: 'Nachricht', messagePlaceholder: 'Gibt es etwas, das wir vor unserer Antwort wissen sollten?',
        sending: 'Wird gesendet ...', send: 'Anfrage senden',
        free: `Kostenlos. Zustellung ${DE_DELIVERY}. `,
        privacyLead: 'Wir verwenden diese Angaben nur, um Ihnen zu antworten. Siehe ',
        privacyLink: 'Datenschutzerklärung',
        network: 'Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung oder schreiben Sie uns direkt auf Telegram.',
        generic: 'Ihre Anfrage konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.',
        openTelegram: 'Telegram öffnen',
        errors: {
            name: 'Bitte geben Sie Ihren Namen an.',
            email: 'Bitte geben Sie eine gültige E-Mail-Adresse an.',
            website: 'Bitte geben Sie Ihre Website oder Ihren Firmennamen an.',
            telegram: 'Bitte prüfen Sie den Telegram-Benutzernamen (zum Beispiel @name).',
            phone: 'Bitte prüfen Sie die Telefonnummer.',
            message: 'Die Nachricht ist zu lang.'
        }
    }
};
