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
        // SmsMessageScreen already renders its own "9:41" status bar — the
        // bezel's copy would just duplicate it.
        hideStatusBar: true,
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
          { path: '/contact-information', label: '"Having trouble uploading, or don’t have the card with you? Click here."' },
        ],
        conditions: [
          { summary: 'No insurance / can’t upload', detail: 'The "Click here" fallback bypasses insurance entirely and goes straight to Contact information.' },
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
        leadsTo: [{ path: '/pa-sms', label: '"Confirm"' }],
        conditions: [
          { summary: 'Prior Authorization is not always required', detail: 'This walkthrough always routes through the PA stage so the end-to-end story is visible. In the real product, a prescription that needs no PA goes straight from here to the "ready to ship" SMS.' },
        ],
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
    id: 'prior-authorization',
    label: 'Prior Authorization',
    // Figma's "Prior Authorization" section. The patient takes no action in
    // this whole stage — it's PHILRx and the doctor working with the insurer,
    // surfaced to the patient as status updates. The PA outcome is the one
    // real fork in the journey: approved and denied both end at "Finalizing
    // your cost", but the copy and the reason differ.
    screens: [
      {
        path: '/pa-sms',
        title: 'SMS: Prior Authorization required',
        trigger: 'The insurer responds to the claim saying a Prior Authorization is needed before they will cover the prescription.',
        action: 'PHILRx texts the patient that a PA is required and begins working with the prescribing doctor to get the form submitted.',
        leadsTo: [{ path: '/pa-required', label: 'Patient taps the "learn more" link' }],
        conditions: [],
        hideStatusBar: true,
      },
      {
        path: '/pa-required',
        title: 'PA required',
        trigger: 'The patient opens their MyPhil account while the PA is outstanding.',
        action: 'The prescription shows "Prior Authorization - required by your insurance" with an explainer of what a PA is and a note that no action is needed from the patient.',
        leadsTo: [
          { path: '/pa-approved-sms', label: 'Insurer approves the PA' },
          { path: '/pa-denied-sms', label: 'Insurer denies the PA' },
        ],
        conditions: [
          { summary: 'PA approved', detail: 'The insurer covers the prescription; PHILRx continues on to finalize the cost.' },
          { summary: 'PA denied', detail: 'The insurer will not cover it; PHILRx falls back to hunting for manufacturer offers instead.' },
        ],
      },
      {
        path: '/pa-approved-sms',
        title: 'SMS: PA approved',
        trigger: 'The insurer approves the Prior Authorization. (Figma: Msg ID STD160.)',
        action: 'PHILRx texts the patient that the insurer approved the PA and is covering the prescription, and that the cost is still being finalized.',
        leadsTo: [{ path: '/pa-approved', label: 'Patient taps the portal link' }],
        conditions: [],
        hideStatusBar: true,
      },
      {
        path: '/pa-approved',
        title: 'PA approved',
        trigger: 'The patient opens their MyPhil account after the approval.',
        action: 'The prescription shows "Prior Authorization approved - continue processing for your lowest cost".',
        leadsTo: [{ path: '/finalizing-cost', label: '"Manage your prescription"' }],
        conditions: [],
      },
      {
        path: '/pa-denied-sms',
        title: 'SMS: PA denied',
        trigger: 'The insurer denies the Prior Authorization. (Figma: Msg ID STD25.1.)',
        action: 'PHILRx texts the patient that the PA was denied, and that it will now look for manufacturer offers the prescription may be eligible for.',
        leadsTo: [{ path: '/pa-denied', label: 'Patient taps the portal link' }],
        conditions: [],
        hideStatusBar: true,
      },
      {
        path: '/pa-denied',
        title: 'PA denied',
        trigger: 'The patient opens their MyPhil account after the denial.',
        action: 'The prescription shows "Continue processing for your lowest cost", explaining the denial and pointing the patient at their insurer for coverage questions.',
        leadsTo: [{ path: '/finalizing-cost', label: '"Manage your prescription"' }],
        conditions: [
          { summary: 'Feeds the Second Chance scenarios', detail: 'A denied PA is the situation the manufacturer-coupon scenarios in Payment Approval are built for — this is where that story starts.' },
        ],
      },
      {
        path: '/finalizing-cost',
        title: 'Finalizing your cost',
        trigger: 'The PA resolves, either way.',
        action: 'PHILRx runs the claim and any applicable manufacturer offers to land on a final price. The patient waits; no action is needed.',
        leadsTo: [{ path: '/checkout-sms', label: 'Price is finalized' }],
        conditions: [
          { summary: 'Shared by both PA outcomes', detail: 'Approved and denied both arrive here — the difference is whether the insurer or a manufacturer offer is doing the work.' },
        ],
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
        title: 'SMS: Ready to ship — approve your cost',
        trigger: 'The price is finalized.',
        action: 'PHILRx finds the best price and texts a payment link to the patient.',
        leadsTo: [{ path: '/login', label: 'Patient taps the SMS link' }],
        conditions: [],
        hideStatusBar: true,
      },
      {
        path: '/my-prescriptions',
        title: 'My prescriptions',
        trigger: 'The patient logs in normally (desktop or standard login, not via the SMS link).',
        action: 'The patient lands on their MyPhil profile and sees their prescription status with a "View your costs" button. Tapping it takes them straight to checkout, showing the finalized cost, payment, and price details.',
        leadsTo: [
          { path: '/payment-scenarios', label: '"View your cost"' },
          { path: '/refill-review', label: '"Refill"' },
        ],
        conditions: [
          { summary: 'One layout, many statuses', detail: 'This is MyPrescriptionsPage at its "cost ready" status. The same component renders the PA, finalizing-cost, shipped, delivery-confirmation and delivered screens too — each at its own route, with copy from prescriptionStatuses.js.' },
        ],
      },
      {
        path: '/payment-scenarios',
        title: 'Payment approval — pick a scenario',
        trigger: 'The patient taps "View your cost" on My prescriptions.',
        action: 'Not a real patient screen — a review-tool picker so this navigator can preview each of the equivalent payment-approval scenarios Figma documents. In the real product a patient would land on exactly one of these, not a menu.',
        leadsTo: [
          { path: '/payment', label: '"Payment"' },
          { path: '/second-chance-enrollment', label: '"Second chance enrollment — banner"' },
          { path: '/second-chance-enrollment?combined=1', label: '"Second chance enrollment — banner (combined)"' },
          { path: '/dual-pricing', label: '"Second chance enrollment — dual pricing"' },
          { path: '/dual-pricing?combined=1', label: '"Second chance enrollment — dual pricing (combined)"' },
          { path: '/refill-review', label: '"Refills"' },
        ],
        conditions: [
          { summary: 'Rendered as a landing page, not inside the phone frame', detail: 'isLandingPage tells FlowPreviewPane to show it full-width in the navigator, signalling that this is a tool for picking a scenario to preview, not something a patient would ever see.' },
        ],
        isLandingPage: true,
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
        leadsTo: [{ path: '/shipping-sms', label: '"Go to my account"' }],
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
    id: 'shipping-delivery',
    label: 'Shipping & Delivery',
    // Figma's "Shipping & Delivery" section. Two SMS touchpoints (shipped,
    // delivered) each landing on a prescription-status screen, plus the
    // signature capture some insurers require as proof of receipt.
    screens: [
      {
        path: '/shipping-sms',
        title: 'SMS: Prescription shipped',
        trigger: 'The pharmacy hands the package to the courier and a tracking number is issued.',
        action: 'PHILRx texts the patient that the order shipped, with a tracking link.',
        leadsTo: [{ path: '/shipped', label: 'Patient taps the tracking link' }],
        conditions: [],
        hideStatusBar: true,
      },
      {
        path: '/shipped',
        title: 'Shipped',
        trigger: 'The patient opens their MyPhil account while the order is in transit.',
        action: 'The prescription shows "Shipped on [date]" with a tracking button. The FAQ switches from the cost questions to the shipping ones.',
        leadsTo: [{ path: '/delivery-sms', label: '"Track your prescription"' }],
        conditions: [],
      },
      {
        path: '/delivery-sms',
        title: 'SMS: Prescription delivered',
        trigger: 'The courier marks the package delivered.',
        action: 'PHILRx texts the patient that the prescription arrived. This one goes out on every delivery, whatever the insurer requires.',
        leadsTo: [{ path: '/delivered', label: 'Patient taps the link' }],
        conditions: [],
        hideStatusBar: true,
      },
      {
        path: '/delivered',
        title: 'Delivered',
        trigger: 'The patient opens their MyPhil account after delivery.',
        action: 'The prescription shows "Delivered on [date]" along with the date the next refill starts processing.',
        leadsTo: [
          { path: '/delivery-signature-sms', label: 'Insurer wants signed proof of receipt' },
          { path: '/refill-sms', label: 'No signature needed — wait for the refill' },
        ],
        conditions: [
          { summary: 'Signature required', detail: 'A second SMS follows asking the patient to sign; the order is not fully closed until they do.' },
          { summary: 'No signature required', detail: 'Delivery is already complete. Nothing more happens until the refill date comes round.' },
        ],
      },
      {
        path: '/delivery-signature-sms',
        title: 'SMS: Signature needed',
        trigger: 'The prescription is delivered and the insurer requires signed proof of receipt.',
        action: 'PHILRx texts a second time asking the patient to sign off on the delivery. (Figma: "Group 8415".)',
        leadsTo: [{ path: '/delivery-confirmation-required', label: 'Patient taps the signing link' }],
        conditions: [
          { summary: 'Only sent for some plans', detail: 'Plans that do not ask for proof of receipt never trigger this message, and the patient never sees the signature screens.' },
        ],
        hideStatusBar: true,
      },
      {
        path: '/delivery-confirmation-required',
        title: 'Delivery confirmation required',
        trigger: 'The patient opens their account after the signature request.',
        action: 'The prescription shows "Delivery confirmation required" and asks the patient to sign. The next refill date is surfaced here too.',
        leadsTo: [{ path: '/delivery-confirmation', label: '"Confirm delivery"' }],
        conditions: [],
      },
      {
        path: '/delivery-confirmation',
        title: 'Delivery confirmation — sign',
        trigger: 'The patient agrees to confirm receipt.',
        action: 'The patient signs to confirm they received the prescription; the signature is stored as proof of delivery for the insurer, closing out the order.',
        leadsTo: [{ path: '/refill-sms', label: '"Confirm delivery" (in the signature modal)' }],
        conditions: [
          { summary: 'Signature box is a static mock', detail: 'The "draw your signature" box matches the Figma frame but is not a real drawing surface — same approach as the signature step inside PaymentAccordions.' },
        ],
      },
    ],
  },
  {
    id: 'refills',
    label: 'Refills',
    screens: [
      {
        path: '/refill-sms',
        title: 'SMS: Refill ready',
        trigger: 'The refill date arrives, or the price changed since the original fill and needs re-approval.',
        action: 'PHILRx texts the patient that their refill is ready to review, with a link straight into checkout.',
        leadsTo: [{ path: '/refill-review', label: 'Patient taps the SMS link' }],
        conditions: [],
        hideStatusBar: true,
      },
      {
        path: '/refill-review',
        title: 'Refill — review and confirm',
        trigger: 'The patient opens the refill link.',
        action: 'Payment approval for the refill, condensed into a single screen: order summary, shipping address, payment method, auto-refill preference, and signature all at once instead of the multi-step original-fill flow.',
        leadsTo: [{ path: '/order-confirmation', label: '"Confirm $XX"' }],
        conditions: [
          { summary: 'Loops back into Shipping & Delivery', detail: 'Confirming a refill produces an order like any other, so it rejoins the journey at Order confirmed and ships from there.' },
        ],
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
