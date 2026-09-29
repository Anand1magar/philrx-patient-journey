# My Phil base flow

A second, separate Vite + React app for a different flow than `../app` (the
enrollment funnel). Built from the same design system in the parent folder
(`../components`, `../tokens`, `../assets`, imported via the `@ds` alias, not
copied) — same pattern as `../app`, different screens.

Source: Figma file "1Q26 - 2Q26 MyPhil Branded Template"
(`10Tk5IOa5hql2baZEgZMeu`), nodes `1486:9349`, `1486:9351`, `1486:12585`.

## Run it

    npm install
    npm run dev

Open the printed localhost URL. Routes:

- `/sms` — recreation of the PhilRx text message that starts this flow
  (tap the link to continue)
- `/welcome` — "Welcome, Patricia!" identity-verification screen (last
  name + DOB). Clicking "Next" once both fields are filled computes age
  from the entered DOB: if under 18, opens the Caregiver modal as an
  overlay; otherwise goes straight to `/insurance-details`.
- `/coupon-enrollment` — combined savings + HIPAA consent, an alternate
  single-step path off `/contact-information` to the same outcome as the
  separate `/savings-enrollment` + `/hipaa-authorization` screens. Both
  paths complete at `/enrollment-success`.
- `/coupon-enrollment-second-chance` — the same screen component, reused
  for the Payment Approval "second chance" coupon offer (reached from
  `/second-chance-enrollment`); its exits and progress bar differ by
  route, see `SavingsHipaaAuthorizationPage.jsx`.

The Caregiver modal ("Caregiver info for minors") is not a route — it's
`components/domain/CaregiverModal`, opened from `/welcome` only when the
patient is a minor. Confirm navigates to `/insurance-details`; Cancel
just closes the modal.

A progress bar (`@ds/components/navigation/ProgressBar`) appears on every
Enrollment-stage screen (`/welcome` through `/enrollment-success`, both
branches), showing percent complete through that branch. It does not
appear on `/coupon-enrollment-second-chance`, since that's a different
stage.

## Verification scripts

`scripts/*.mjs` are Playwright headless-browser walkthroughs (no unit
test framework — see Known limitations). Run `npm run dev` first, then
from this directory: `node scripts/verify-baseline.mjs`,
`verify-caregiver-modal.mjs`, `verify-coupon-routing.mjs`,
`verify-progress-bar.mjs`, `verify-second-chance-unaffected.mjs`.
Screenshots land in `scripts/out-*.png`.

## Design-system changes made for this flow

- `components/domain/CaregiverModal/CaregiverModal.jsx` was rewritten to
  match the real Figma spec (it previously didn't match at all — different
  copy, different fields). Now reuses the shared `Modal`, `Radio`, and
  `Button` components.
- New shared assets added: `assets/logos/philrx-logo-color.png`,
  `assets/images/trustpilot-rating.png`,
  `assets/images/bbb-accredited-business.jpg`,
  `assets/images/soc2-badge.png`, `assets/icons/hipaa-badge/*.svg`.

## Adding a screen

1. Get the Figma link for the screen from the user.
2. Pull it via the Figma MCP (`get_design_context`).
3. Add a page component under `src/pages/`, composing existing
   `@ds/components/...` where possible; extend a design-system component
   if a real one exists but doesn't match, add a new one if nothing does.
4. Add the route in `src/App.jsx` and wire navigation from adjacent screens.

## Known limitations

Same as `../app`: no TypeScript and no automated tests, so `npm run build`
won't catch a design-system component's prop contract silently changing.
The SMS screen (`/sms`) intentionally keeps its iOS status-bar chrome
(static "9:41", battery/wifi icons) since it's recreating a native Messages
app screenshot, not a real app screen — `/welcome` and the rest of this
app do not fake a status bar, matching `../app`'s convention.
