# J&J CAPLYTA

White-label brand built from `../myphil-base-flow`, following the convention in
`projects/README.md`: a complete standalone copy that shares the design system at
the repo root (`../../components`, `../../tokens`, `../../assets`) through the
`@ds` Vite alias. Only brand identity, the screen set, and the payment model
differ from the base flow.

## Run it

    npm install
    npm run dev

Opens at `/flow`, the journey navigator. `/` redirects there.

## What's brand-specific

| Area | File |
|---|---|
| Colors (`--sky` family, secondary, tagline) | `src/brand-theme.css` |
| Marketing header logo + tagline | `src/components/BrandHeader.jsx` |
| In-app header logo | `src/components/BrandAppHeader.jsx` |
| Johnson & Johnson footer | `src/components/JnjFooter.jsx` |
| Four payment coverage variants | `src/paymentCoverages.js` |
| Screen set and order | `src/pageRegistry.js` |
| Navigator stage/screen metadata | `src/flow/flowData.js` |

Primary is `#00587D`; hover / disabled / tint are derived from it. Secondary is
`#B587B8`. Everything else stays on base defaults.

`src/assets/caplyta-logo.svg` is a **placeholder** wordmark, per the brand spec —
no real CAPLYTA trademark asset is committed. Swap that one file when the real
mark arrives. The J&J footer mark (`src/assets/jnj-logo.svg`) is the real asset
from the client's Figma file.

## Screen flow

Enrollment (8 screens, progress bar on `/welcome` → `/enrollment-success`):

    /sms → /welcome → /insurance-details → /contact-information
         → /hipaa-authorization → /savings-enrollment
         → /enrollment-success → /create-password

`/hipaa-authorization` and `/savings-enrollment` are both optional — "No thanks"
and "Decline enrollment" continue the flow rather than blocking it.

Then the funnel continues, each stage carrying its SMS autocomms and its app
screens: **Prior Authorization** → **Payment Approval** → **Shipping & Delivery**
→ **Refills**. Refills sit at the end: the refill SMS routes through the log-in
chain (`/login?next=refill`), not straight into the review screen.

**Excluded from the base flow:** caregiver modal, insurance card upload/review,
combined coupon-enrollment screen, and the second-chance / dual-pricing payment
scenarios.

## Payment approval

One screen at four coverage types, each its own route so the navigator can
deep-link them. Defined in `src/paymentCoverages.js`:

| Coverage | Total | PAP banner |
|---|---|---|
| Commercial — covered | $0 | no |
| Commercial — not covered | $100 | no |
| Uninsured | $450 | yes |
| Government-sponsored | $450 | yes |

The patient-assistance banner links to
`https://www.portal.jnjwithme.com/patient-assistance` and sits inside the order
summary, matching Figma `10Tk5IOa5hql2baZEgZMeu` node `2373:9370`.

Prices are client-supplied placeholders — `$100` and `$450` especially.

## Journey side panels

`/flow` shows the preview between two panels: `FlowSidebar.jsx` on the left lists
every stage and screen in order with the patient's position ("Step N of 36",
completed steps checked), and `FlowInfoPanel.jsx` on the right explains the
selected screen's trigger and system action.

## Verification

    npm run dev
    node scripts/record-journey.mjs http://localhost:<port>

Walks all 36 screens, writes `scripts/out/journey/NN-<name>.png` plus
`caplyta-journey.webm`, and asserts: no base-brand string survives in visible
copy or attributes, text notifications and auto-refill default to checked, the
PAP banner appears on exactly the uninsured and government coverages, the log-in
chain reaches the one-time code, `?next=refill` returns to the refill review, and
the sidebar reports journey position. Exits non-zero on any failure or console
error.

`scripts/verify-baseline.mjs` and `verify-progress-bar.mjs` carry over from the
base flow and target its port.

## Known limitations

Same as the base flow: no TypeScript and no unit tests, so `npm run build` won't
catch a design-system component's prop contract changing. The SMS screens keep
their iOS status-bar chrome, since they recreate native Messages screenshots.
