# Surface brief: home (`/`) and case studies (`/work/[slug]`)

Mode: Experience. The site's own craft is the main exhibit, because the real work can't be shown.

## Direction contract

THESIS: The site is a settlement statement from the systems Kawser builds. Work arrives as a brief, ships, and reconciles. It refuses the developer-portfolio template: a giant hello, a tech-logo grid, a timeline, and same-size project cards.

OWN-WORLD: Navy statement paper (`#0a192f`) ruled with hairline ledgers. Archivo uses its width axis: condensed uppercase for statement headers, normal width for prose. Martian Mono is only for codes, periods, figures and status. Mint (`#62f9d5`) only ever means matched/reconciled. Amber only ever means pending. One drenched mint field closes the page. Rows, rules, stamps and totals are the only components.

STORY: The visitor sees eight real work items reconcile into his name. They learn which systems he shipped and for whom (the line items), see one working reconciliation table, and leave with the resume or an email.

FIRST VIEWPORT: Left 5/12 holds the name, condensed, across three lines at up to 6rem, then the role line, then Resume (primary) and Email. Right 7/12 holds the reconciliation board: 8 rows (code, item, period, status). They start amber and pending, re-sort with Flip, and turn mint. A total row reads "8 / 8 reconciled · 0 open", then a RECONCILED stamp lands over the board's corner. A statement meta strip runs across the top.

FORM: Settlement statement / reconciliation ledger. First on the ordered list (Reconciled > Roaming > Rickshaw). No seed key: concept-seed was unavailable because the launcher was blocked, and the direction was chosen by the user in conversation.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Signature interaction
The ReconcileDemo on `/work/neustring`: a synthetic partner-settlement table. "Run reconciliation" checks each row, flags discrepancies in amber, matches in mint, and floats discrepancies to the top with GSAP Flip. It has filters and an aria-live summary.

## Motion grammar
Rows slide and lock, rules draw left to right, stamps land, the name rises out of a mask. Everything starts from an already-visible default (JS-gated) and respects reduced motion.
