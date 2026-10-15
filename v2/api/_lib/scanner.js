// SCANNER PLACEHOLDER
//
// The Free Quick Look scanner is the next project. Until then this stub keeps the rest of the
// site honest: every Quick Look request is forwarded to Telegram and handled by hand.
//
// To connect the real scanner, replace the body of runQuickLook() and keep this contract:
//
//   Input:   { target }   the visitor's website or company name, exactly as typed (max 300 chars)
//   Output:  {
//     status: 'completed' | 'queued' | 'not_configured' | 'failed',
//     ratings: {                       // only when status is 'completed'
//       found:   'Strong' | 'Developing' | 'Priority focus',
//       trusted: 'Strong' | 'Developing' | 'Priority focus',
//       reached: 'Strong' | 'Developing' | 'Priority focus'
//     },
//     findings: [                      // evidence only: every finding names its source and date
//       { area: 'found' | 'trusted' | 'reached', text: string, source: string, date: 'YYYY-MM-DD' | 'N/A' }
//     ]
//   }
//
// Brand rules the scanner output must follow: public information only, anything that cannot be
// verified is marked N/A (never estimated), rating words are Strong / Developing / Priority focus
// (no red/green scores or school grades).
//
// Also flip `scannerEnabled` in src/content/site.js so the hero and the success message stop
// describing the Quick Look as a manual request.

async function runQuickLook({ target }) {
    return { status: 'not_configured', target };
}

module.exports = { runQuickLook };
