// Metadata for the /flow navigator. Kept separate from pageRegistry.js
// (which maps path -> component) so this stays plain data: trigger / system
// action text is lifted from the client's requirement spec, and leadsTo /
// conditions are read directly off each page's navigate() calls, not guessed.

export const FLOW_STAGES = [
  {
    id: 'enrollment',
    label: 'Enrollment',
    screens: [
      {
        path: '/sms',
        title: 'Rx received from doctor',
        trigger: 'The prescribing doctor sends the prescription to PHILRx through BestRx.',
        action: 'The order is created, the drug is validated, and the day-0 SMS timer starts.',
        leadsTo: [{ path: '/welcome', label: 'Patient taps the SMS link' }],
        conditions: [],
      },
      {
        path: '/welcome',
        title: 'Welcome & identity match',
        trigger: 'The patient opens the welcome link and submits their identifying details.',
        action: 'PHILRx matches the submission against the prescription record and issues a session token on success. A caregiver modal appears when relevant.',
        leadsTo: [{ path: '/insurance-details', label: 'Identity confirmed' }],
        conditions: [
          { summary: 'Patient is a minor by DOB', detail: 'A caregiver modal shows first; confirming it continues to Insurance details.' },
          { summary: 'Patient is an adult', detail: 'Goes straight to Insurance details, no modal.' },
        ],
      },
      {
        path: '/insurance-details',
        title: 'Insurance details',
        trigger: 'The patient reaches the insurance step.',
        action: 'PHILRx looks up the payer database and pre-fills the BIN, RxGroup, and PCN fields.',
        leadsTo: [
          { path: '/contact-information', label: '"Use this insurance card"' },
          { path: '/insurance-card-upload', label: '"No, I have a different card"' },
        ],
        conditions: [
          { summary: 'Pre-filled card is correct', detail: 'Patient accepts it and moves to Contact information.' },
          { summary: 'Pre-filled card is wrong', detail: 'Patient is sent to upload their own card instead.' },
        ],
      },
      {
        path: '/insurance-card-upload',
        title: 'Insurance upload',
        trigger: 'Not specified in the client spec.',
        action: 'Patient photographs or uploads their insurance card as an alternative to the auto-matched card on Insurance details.',
        leadsTo: [
          { path: '/insurance-card-review', label: 'Photo taken' },
          { path: '/contact-information', label: '"I don’t have prescription insurance"' },
        ],
        conditions: [
          { summary: 'No insurance', detail: 'Skip link bypasses insurance entirely and goes straight to Contact information.' },
        ],
      },
      {
        path: '/insurance-card-review',
        title: 'Insurance upload — review',
        trigger: 'Not specified in the client spec.',
        action: 'Patient reviews the captured insurance card photo before continuing.',
        leadsTo: [
          { path: '/insurance-card-upload', label: '"Retake photo"' },
          { path: '/contact-information', label: '"Save"' },
        ],
        conditions: [],
      },
      {
        path: '/contact-information',
        title: 'Contact information',
        trigger: 'The patient submits their contact details.',
        action: 'A patient profile is created with address, communication preferences, and default allergy/medication history.',
        leadsTo: [
          { path: '/savings-enrollment', label: '"Next"' },
          { path: '/coupon-enrollment', label: '"Prefer to do savings & HIPAA in one step?"' },
          { path: '/insurance-card-upload', label: '"upload it here" (secondary insurance prompt)' },
        ],
        conditions: [
          { summary: 'Standard path', detail: 'Continues to Savings enrollment as a separate step.' },
          { summary: 'Combined shortcut', detail: 'A link skips ahead to the combined Coupon enrollment screen (savings + HIPAA together).' },
        ],
      },
      {
        path: '/savings-enrollment',
        title: 'Savings enrollment',
        trigger: 'The patient reaches the savings step.',
        action: 'Manufacturer coupon eligibility is checked, with government-plan exclusion logic applied.',
        leadsTo: [{ path: '/hipaa-authorization', label: '"Agree and enroll" (or decline-modal "Enroll")' }],
        conditions: [],
      },
      {
        path: '/hipaa-authorization',
        title: 'HIPAA authorization',
        trigger: 'The patient signs the HIPAA authorization.',
        action: 'The signed authorization is stored, manufacturer data-sharing is activated, and a 5-year expiry timer starts.',
        leadsTo: [{ path: '/enrollment-success', label: '"Confirm" or "No thanks" (both continue)' }],
        conditions: [],
      },
      {
        path: '/coupon-enrollment',
        title: 'Coupon enrollment',
        trigger: 'The patient completes savings + authorization together.',
        action: 'Coupon eligibility is confirmed, exclusions applied, authorization stored, data-sharing activated, and the 5-year timer starts.',
        leadsTo: [{ path: '/enrollment-success', label: 'Enrollment completed' }],
        conditions: [
          { summary: 'Shares a component with Second-chance enrollment', detail: 'Same SavingsHipaaAuthorizationPage component; branches on the current path to decide where "enroll" goes.' },
        ],
      },
      {
        path: '/create-password',
        title: 'Create password',
        trigger: 'The patient has completed enrollment.',
        action: 'The patient can optionally set a password for their profile. It isn’t required — if they skip it, they can still log in later via a one-time code sent to their email or phone.',
        leadsTo: [{ path: '/checkout-sms', label: '"Confirm"' }],
        conditions: [],
      },
      {
        path: '/enrollment-success',
        title: 'Enrollment complete',
        trigger: 'All enrollment steps are finished.',
        action: 'The order is sent to the partner pharmacy network, and the tech team begins insurance and price processing.',
        leadsTo: [{ path: '/create-password', label: '"Set up password"' }],
        conditions: [],
      },
    ],
  },
  {
    id: 'cashflow',
    label: 'Cash-Pay Onboarding (cashflow-phil)',
    // A separate reference app (github.com/Anand1magar/cashflow-phil), not part
    // of this codebase — the alternate onboarding path for patients paying cash
    // instead of using insurance. Built from Figma as a standalone prototype:
    // plain CSS, hash routing, no backend. Embedded live via iframe against its
    // own dev server (see FlowPreviewPane.jsx) rather than ported into this app,
    // since it's a different project with its own design system.
    external: { origin: 'http://localhost:5174' },
    screens: [
      {
        path: '/cashflow/welcome',
        title: 'Welcome / confirm identity',
        hash: 'welcome',
        trigger: 'Entry point of the cash-pay flow.',
        action: 'Patient lands on the welcome screen and confirms their identity to begin cash-pay onboarding.',
        leadsTo: [{ path: '/cashflow/notifications', label: 'Continue' }],
        conditions: [],
      },
      {
        path: '/cashflow/notifications',
        title: 'Notification preferences',
        hash: 'notifications',
        trigger: 'Patient continues from Welcome.',
        action: 'Patient chooses how they want to be notified about their order (29% progress).',
        leadsTo: [{ path: '/cashflow/best-price', label: 'Continue' }],
        conditions: [],
      },
      {
        path: '/cashflow/best-price',
        title: 'Best price found',
        hash: 'best-price',
        trigger: 'Patient continues from Notification preferences.',
        action: 'The cash price for the prescription is presented (43% progress).',
        leadsTo: [{ path: '/cashflow/shipping-address', label: 'Continue' }],
        conditions: [],
      },
      {
        path: '/cashflow/shipping-address',
        title: 'Shipping address',
        hash: 'shipping-address',
        trigger: 'Patient continues from Best price found.',
        action: 'Patient enters where the prescription should ship (57% progress).',
        leadsTo: [{ path: '/cashflow/payment', label: 'Continue' }],
        conditions: [],
      },
      {
        path: '/cashflow/payment',
        title: 'Payment information',
        hash: 'payment',
        trigger: 'Patient continues from Shipping address.',
        action: 'Patient enters payment details to complete the cash-pay purchase (57% progress).',
        leadsTo: [{ path: '/cashflow/health-info', label: 'Continue' }],
        conditions: [],
      },
      {
        path: '/cashflow/health-info',
        title: 'Health information',
        hash: 'health-info',
        trigger: 'Patient continues from Payment information.',
        action: 'Patient provides health/allergy information used to fill the order (86% progress).',
        leadsTo: [{ path: '/cashflow/delivery', label: 'Continue' }],
        conditions: [],
      },
      {
        path: '/cashflow/delivery',
        title: 'Success / delivery',
        hash: 'delivery',
        trigger: 'Patient continues from Health information.',
        action: 'Confirms the order and shows delivery details (100% progress). This screen has no CTA — it just confirms.',
        leadsTo: [{ path: '/cashflow/create-password', label: 'Continue' }],
        conditions: [],
      },
      {
        path: '/cashflow/create-password',
        title: 'Set up your password',
        hash: 'create-password',
        trigger: 'Patient continues from the delivery confirmation.',
        action: 'Patient optionally sets a password for their account, mirroring the insurance-flow Create password screen.',
        leadsTo: [{ path: '/cashflow/welcome', label: 'Continue (prototype wraps back to the start)' }],
        conditions: [
          { summary: 'This is a standalone prototype, not this app', detail: 'It lives in a separate repo (cashflow-phil) with its own hash router and plain-CSS design system — embedded here via iframe, not imported as React components.' },
        ],
      },
    ],
  },
  {
    id: 'login',
    label: 'Log In',
    screens: [
      {
        path: '/login',
        title: 'Login',
        trigger: 'The patient opens the login screen (reached from the payment link).',
        action: 'The patient logs in with email and password, or chooses to verify with a one-time code instead.',
        leadsTo: [{ path: '/confirm-identity', label: '"Log In"' }],
        conditions: [],
      },
      {
        path: '/confirm-identity',
        title: 'Confirm identity',
        trigger: 'The patient chooses the one-time code option on the login screen.',
        action: 'The patient enters their name and date of birth and submits, which dispatches a verification code to their email or phone, based on their preference.',
        leadsTo: [{ path: '/otp-delivery', label: '"Confirm"' }],
        conditions: [],
      },
      {
        path: '/otp-delivery',
        title: 'OTP sent',
        trigger: 'The patient submits the confirm-identity form.',
        action: 'A verification code is generated and delivered to the patient’s email or phone, based on their preference.',
        leadsTo: [{ path: '/otp-verify', label: '"Send Code"' }],
        conditions: [],
      },
      {
        path: '/otp-verify',
        title: 'OTP verification',
        trigger: 'The patient receives the verification code.',
        action: 'The patient enters the code to log into their profile.',
        leadsTo: [{ path: '/my-prescriptions', label: 'Code verified' }],
        conditions: [],
      },
    ],
  },
  {
    id: 'payment-approval',
    label: 'Payment Approval',
    screens: [
      {
        path: '/checkout-sms',
        title: 'Best price found',
        trigger: 'The price is finalized.',
        action: 'PHILRx finds the best price and texts a payment link to the patient.',
        leadsTo: [{ path: '/login', label: 'Patient taps the SMS link' }],
        conditions: [],
      },
      {
        path: '/my-prescriptions',
        title: 'My prescriptions',
        trigger: 'The patient logs in normally (desktop or standard login, not via the SMS link).',
        action: 'The patient lands on their MyPhil profile and sees their prescription status with a "View your costs" button. Tapping it takes them straight to checkout, showing the finalized cost, payment, and price details.',
        leadsTo: [
          { path: '/payment', label: '"View your cost"' },
          { path: '/refill-review', label: '"Refill"' },
        ],
        conditions: [
          { summary: 'Reused across stages', detail: 'This same screen, with a different status, also serves the Shipping ("estimated delivery shown") and Delivered ("marked delivered") stages — there is no separate route for those.' },
        ],
      },
      {
        path: '/payment',
        title: 'Scenario: Payment',
        trigger: 'The patient clicks the payment link directly from the checkout SMS.',
        action: 'The patient goes straight to checkout, where they can see the price.',
        leadsTo: [{ path: '/order-confirmation', label: '"Confirm $XX" (in the signature accordion)' }],
        conditions: [
          { summary: 'Payment-offer / signature step', detail: 'The spec’s separate "payment-offer" (signature) screen is folded into this page as an accordion section rather than its own route.' },
        ],
      },
      {
        path: '/order-confirmation',
        title: 'Order confirmed',
        trigger: 'The patient completes payment.',
        action: 'The signature is captured, payment is charged, and the order status moves to preparing-to-ship.',
        leadsTo: [{ path: '/my-prescriptions', label: '"Go to my account"' }],
        conditions: [],
      },
    ],
  },
  {
    id: 'second-chance',
    label: 'Payment Scenarios — Second Chance',
    // These map 1:1 onto the 6 named scenarios on the old /payment-scenarios
    // picker page — titles here match that page's scenario names exactly, so
    // it's unambiguous which scenario each screen belongs to. Two of the six
    // (the "combined" variants) are the *same route* as their plain sibling
    // with a ?combined=1 query param that changes the page's behavior — see
    // SecondChanceEnrollmentPage.jsx / DualPricingPage.jsx.
    screens: [
      {
        path: '/second-chance-enrollment',
        title: 'Scenario: Second chance enrollment — banner',
        trigger: 'The patient clicks the payment link directly from the checkout SMS. The patient did not originally enroll in the manufacturer coupon.',
        action: 'The patient is offered another chance to enroll in the coupon program.',
        leadsTo: [{ path: '/coupon-enrollment-second-chance', label: '"Enroll now"' }],
        conditions: [
          { summary: 'Combined variant is a separate sidebar entry', detail: '?combined=1 on this same route is the "banner (combined)" scenario below — same component, different behavior.' },
        ],
      },
      {
        path: '/coupon-enrollment-second-chance',
        title: 'Coupon enrollment (second chance)',
        trigger: 'The patient accepts the second-chance offer.',
        action: 'The patient completes coupon enrollment.',
        leadsTo: [{ path: '/second-chance-enrolled', label: 'Enrollment completed' }],
        conditions: [
          { summary: 'Shares a component with Enrollment-stage Coupon enrollment', detail: 'Same SavingsHipaaAuthorizationPage component as /coupon-enrollment; behaves like a later chance to enroll during Payment Approval.' },
        ],
      },
      {
        path: '/second-chance-enrollment?combined=1',
        title: 'Scenario: Second chance enrollment — banner (combined)',
        trigger: 'Same entry point as the banner scenario, with HIPAA + coupon combined into one step.',
        action: 'The banner flow, but enrolling opens one screen with the eligibility and HIPAA checkboxes plus the signature, rather than a terms scroll-box.',
        leadsTo: [{ path: '/second-chance-consent', label: '"Enroll now"' }],
        conditions: [
          { summary: 'combined query param', detail: '?combined=1 sends "enroll" to the combined consent screen instead of the terms scroll-box.' },
        ],
      },
      {
        path: '/second-chance-consent',
        title: 'Second-chance enrollment (combined)',
        trigger: 'The patient enrolls via the "combined" second-chance path.',
        action: 'Eligibility + HIPAA checkboxes and the signature appear on one screen, instead of a separate terms scroll-box. Second step of the "banner (combined)" scenario above.',
        leadsTo: [
          { path: '/second-chance-enrolled', label: '"Enroll"' },
          { path: '/second-chance-enrollment', label: '"Decline"' },
        ],
        conditions: [],
      },
      {
        path: '/second-chance-enrolled',
        title: 'Coupon applied confirmation',
        trigger: 'The patient completes second-chance coupon enrollment.',
        action: 'PHILRx confirms that the order will be rerun with the coupon applied.',
        leadsTo: [{ path: '/my-prescriptions', label: '"Go to my account"' }],
        conditions: [],
      },
      {
        path: '/dual-pricing',
        title: 'Scenario: Second chance enrollment — dual pricing',
        trigger: 'The patient clicks the payment link directly from the checkout SMS. The patient is on the payment screen and toggles between price options.',
        action: 'Toggling to the manufacturer offer surfaces its eligibility criteria right on the screen. The patient accepts it, then can continue and complete checkout.',
        leadsTo: [],
        conditions: [
          { summary: 'No outgoing navigation wired yet', detail: 'This is a standalone pricing-toggle demo screen — it doesn’t currently link onward to checkout.' },
          { summary: 'Combined variant is a separate sidebar entry', detail: '?combined=1 on this same route is the "dual pricing (combined)" scenario below.' },
        ],
      },
      {
        path: '/dual-pricing?combined=1',
        title: 'Scenario: Second chance enrollment — dual pricing (combined)',
        trigger: 'Same entry point as dual pricing, with HIPAA + coupon combined inline.',
        action: 'Dual pricing where choosing the manufacturer offer expands the order summary to hold the consent checkboxes and signature inline.',
        leadsTo: [],
        conditions: [
          { summary: 'No outgoing navigation wired yet', detail: 'This is a standalone pricing-toggle demo screen — it doesn’t currently link onward to checkout.' },
        ],
      },
    ],
  },
  {
    id: 'refills',
    label: 'Refills',
    screens: [
      {
        path: '/refill-review',
        title: 'Scenario: Refills',
        trigger: 'The patient selected manual refill, or the price changed since the original fill.',
        action: 'PHILRx sends an SMS letting the patient know their price is ready to review. Tapping it walks them through payment approval, the same idea as the original fill, but condensed into a single screen instead of the multi-step flow.',
        leadsTo: [{ path: '/order-confirmation', label: '"Confirm $XX"' }],
        conditions: [],
      },
    ],
  },
];

export const FLOW_SCREEN_BY_PATH = Object.fromEntries(
  FLOW_STAGES.flatMap((stage) => stage.screens.map((screen) => [
    screen.path,
    { ...screen, stage: stage.label, external: stage.external },
  ])),
);
