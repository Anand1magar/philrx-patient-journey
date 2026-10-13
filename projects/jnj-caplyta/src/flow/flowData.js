import { COVERAGES } from '../paymentCoverages.js';

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
        trigger: 'The prescribing doctor sends the prescription to J&J Direct through BestRx.',
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
        trigger: 'The patient opens the welcome link and submits their last name and date of birth.',
        action: 'J&J Direct matches the submission against the prescription record and issues a session token on success.',
        leadsTo: [{ path: '/insurance-details', label: 'Identity confirmed' }],
        conditions: [
          { summary: 'Caregiver flow excluded', detail: 'This brand omits the minor/caregiver modal the base flow carries, so every patient goes straight to Insurance details.' },
        ],
      },
      {
        path: '/insurance-details',
        title: 'Insurance details',
        trigger: 'The patient reaches the insurance step.',
        action: 'J&J Direct looks up the payer database and pre-fills the BIN, RxGroup, and PCN fields for the patient to confirm.',
        leadsTo: [{ path: '/contact-information', label: '"Use this insurance card"' }],
        conditions: [
          { summary: 'Card upload excluded', detail: 'This brand confirms the insurance already on file; the base flow\'s photo-upload branch is not part of the funnel.' },
        ],
      },
      {
        path: '/contact-information',
        title: 'Contact information',
        trigger: 'The patient confirms or updates their contact details.',
        action: 'A patient profile is created with address, communication preferences, and default allergy/medication history.',
        leadsTo: [{ path: '/hipaa-authorization', label: '"Next"' }],
        conditions: [
          { summary: 'Text notifications are on by default', detail: 'The "Text message" preference starts checked — it is the recommended channel, and the one the log-in code screen defaults to later.' },
        ],
      },
      {
        path: '/hipaa-authorization',
        title: 'HIPAA authorization',
        trigger: 'The patient reviews and signs the HIPAA authorization.',
        action: 'The signed authorization is stored and manufacturer data-sharing is activated.',
        leadsTo: [{ path: '/savings-enrollment', label: '"Confirm" or "No thanks" (both continue)' }],
        conditions: [
          { summary: 'Optional', detail: '"No thanks" skips signing and still continues to the savings step — enrollment is not conditioned on authorizing.' },
        ],
      },
      {
        path: '/savings-enrollment',
        title: 'Terms and Conditions',
        trigger: 'The patient reaches the savings step.',
        action: 'CAPLYTA withMe Savings Program eligibility is checked, with government-plan exclusion logic applied.',
        leadsTo: [{ path: '/enrollment-success', label: '"Agree and enroll" (or decline-modal "Enroll")' }],
        conditions: [
          { summary: 'Optional', detail: '"Decline enrollment" opens a confirmation modal; declining still completes enrollment without the savings program.' },
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
      {
        path: '/create-password',
        title: 'Create password',
        trigger: 'The patient has completed enrollment.',
        action: 'The patient can optionally set a password for their profile. It isn\'t required — if they skip it, they can still log in later via a one-time code.',
        leadsTo: [{ path: '/pa-sms', label: '"Confirm"' }],
        conditions: [
          { summary: 'Prior Authorization is not always required', detail: 'This walkthrough always routes through the PA stage so the end-to-end story is visible. In the real product, a prescription that needs no PA goes straight from here to the "ready to ship" SMS.' },
        ],
      },
    ],
  },
  {
    id: 'prior-authorization',
    label: 'Prior Authorization',
    // Figma's "Prior Authorization" section. The patient takes no action in
    // this whole stage — it's J&J Direct and the doctor working with the insurer,
    // surfaced to the patient as status updates. The PA outcome is the one
    // real fork in the journey: approved and denied both end at "Finalizing
    // your cost", but the copy and the reason differ.
    screens: [
      {
        path: '/pa-sms',
        title: 'SMS: Prior Authorization required',
        trigger: 'The insurer responds to the claim saying a Prior Authorization is needed before they will cover the prescription.',
        action: 'J&J Direct texts the patient that a PA is required and begins working with the prescribing doctor to get the form submitted.',
        leadsTo: [{ path: '/pa-required', label: 'Patient taps the "learn more" link' }],
        conditions: [],
        hideStatusBar: true,
      },
      {
        path: '/pa-required',
        title: 'PA required',
        trigger: 'The patient opens their J&J Direct account while the PA is outstanding.',
        action: 'The prescription shows "Prior Authorization - required by your insurance" with an explainer of what a PA is and a note that no action is needed from the patient.',
        leadsTo: [
          { path: '/pa-approved-sms', label: 'Insurer approves the PA' },
          { path: '/pa-denied-sms', label: 'Insurer denies the PA' },
        ],
        conditions: [
          { summary: 'PA approved', detail: 'The insurer covers the prescription; J&J Direct continues on to finalize the cost.' },
          { summary: 'PA denied', detail: 'The insurer will not cover it; J&J Direct falls back to hunting for manufacturer offers instead.' },
        ],
      },
      {
        path: '/pa-approved-sms',
        title: 'SMS: PA approved',
        trigger: 'The insurer approves the Prior Authorization. (Figma: Msg ID STD160.)',
        action: 'J&J Direct texts the patient that the insurer approved the PA and is covering the prescription, and that the cost is still being finalized.',
        leadsTo: [{ path: '/pa-approved', label: 'Patient taps the portal link' }],
        conditions: [],
        hideStatusBar: true,
      },
      {
        path: '/pa-approved',
        title: 'PA approved',
        trigger: 'The patient opens their J&J Direct account after the approval.',
        action: 'The prescription shows "Prior Authorization approved - continue processing for your lowest cost".',
        leadsTo: [{ path: '/finalizing-cost', label: '"Manage your prescription"' }],
        conditions: [],
      },
      {
        path: '/pa-denied-sms',
        title: 'SMS: PA denied',
        trigger: 'The insurer denies the Prior Authorization. (Figma: Msg ID STD25.1.)',
        action: 'J&J Direct texts the patient that the PA was denied, and that it will now look for manufacturer offers the prescription may be eligible for.',
        leadsTo: [{ path: '/pa-denied', label: 'Patient taps the portal link' }],
        conditions: [],
        hideStatusBar: true,
      },
      {
        path: '/pa-denied',
        title: 'PA denied',
        trigger: 'The patient opens their J&J Direct account after the denial.',
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
        action: 'J&J Direct runs the claim and any applicable manufacturer offers to land on a final price. The patient waits; no action is needed.',
        leadsTo: [{ path: '/checkout-sms', label: 'Price is finalized' }],
        conditions: [
          { summary: 'Shared by both PA outcomes', detail: 'Approved and denied both arrive here — the difference is whether the insurer or a manufacturer offer is doing the work.' },
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
        trigger: 'The patient opens the login screen (reached from the payment link, or from the refill link after delivery).',
        action: 'The patient logs in with email and password, or chooses to verify with a one-time code instead. Either way the log-in finishes on the one-time code — a password alone never completes it.',
        leadsTo: [
          { path: '/confirm-identity', label: '"Log In"' },
          { path: '/otp-delivery', label: '"Log in with one-time code" — skips the identity step' },
        ],
        conditions: [
          { summary: 'Arrived from the refill SMS', detail: 'The link carries ?next=refill, which every screen in the chain forwards and only /otp-verify consumes, so verifying returns to Refill review instead of payment approval.' },
        ],
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
        action: 'The patient enters the code to log into their profile. This is the screen that consumes ?next= and decides where the chain lands.',
        leadsTo: [
          { path: '/payment-scenarios', label: 'Code verified — arrived from the checkout SMS' },
          { path: '/refill-review', label: 'Code verified — arrived from the refill SMS (?next=refill)' },
        ],
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
        action: 'J&J Direct finds the best price and texts a payment link to the patient.',
        leadsTo: [{ path: '/login', label: 'Patient taps the SMS link' }],
        conditions: [],
        hideStatusBar: true,
      },
      {
        path: '/my-prescriptions',
        title: 'My prescriptions',
        trigger: 'The patient logs in normally (desktop or standard login, not via the SMS link).',
        action: 'The patient lands on their J&J Direct profile and sees their prescription status with a "View your costs" button. Tapping it takes them straight to checkout, showing the finalized cost, payment, and price details.',
        leadsTo: [
          { path: '/payment-scenarios', label: '"View your cost"' },
        ],
        conditions: [
          { summary: 'One layout, many statuses', detail: 'This is MyPrescriptionsPage at its "cost ready" status. The same component renders the PA, finalizing-cost, shipped, delivery-confirmation and delivered screens too — each at its own route, with copy from prescriptionStatuses.js.' },
        ],
      },
      {
        path: '/payment-scenarios',
        title: 'Payment approval — coverage types',
        trigger: 'The patient taps "View your cost" on My prescriptions.',
        action: 'Not a real patient screen — a review-tool picker so this navigator can preview each coverage outcome. In the real product the patient lands on exactly one of these, decided by the coverage on file.',
        leadsTo: COVERAGES.map((c) => ({ path: c.path, label: `"${c.name}" — ${c.total}` })),
        conditions: [
          { summary: 'Rendered as a landing page, not inside the phone frame', detail: 'isLandingPage tells FlowPreviewPane to show it full-width in the navigator, signalling that this is a tool for picking a coverage to preview, not something a patient would ever see.' },
        ],
        isLandingPage: true,
      },
      // The same payment-approval screen at each coverage type. Generated from
      // paymentCoverages.js so this list cannot drift from the routes
      // pageRegistry.js actually registers.
      ...COVERAGES.map((c) => ({
        path: c.path,
        title: `Payment approval — ${c.name}`,
        trigger: 'The patient opens their finalized cost.',
        action: c.description,
        leadsTo: [{ path: '/order-confirmation', label: `"Confirm ${c.total}" (in the signature accordion)` }],
        conditions: c.papBanner
          ? [{ summary: 'Patient assistance banner shows', detail: 'Coverage leaves the patient at the full cash price, so the order summary carries a banner linking to the J&J patient assistance program.' }]
          : [{ summary: 'No patient assistance banner', detail: 'Coverage already brings the cost down, so the assistance banner is not shown.' }],
      })),
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
        action: 'J&J Direct texts the patient that the order shipped, with a tracking link.',
        leadsTo: [{ path: '/shipped', label: 'Patient taps the tracking link' }],
        conditions: [],
        hideStatusBar: true,
      },
      {
        path: '/shipped',
        title: 'Shipped',
        trigger: 'The patient opens their J&J Direct account while the order is in transit.',
        action: 'The prescription shows "Shipped on [date]" with a tracking button. The FAQ switches from the cost questions to the shipping ones.',
        leadsTo: [{ path: '/delivery-sms', label: '"Track your prescription"' }],
        conditions: [],
      },
      {
        path: '/delivery-sms',
        title: 'SMS: Prescription delivered',
        trigger: 'The courier marks the package delivered.',
        action: 'J&J Direct texts the patient that the prescription arrived. This one goes out on every delivery, whatever the insurer requires.',
        leadsTo: [{ path: '/delivered', label: 'Patient taps the link' }],
        conditions: [],
        hideStatusBar: true,
      },
      {
        path: '/delivered',
        title: 'Delivered',
        trigger: 'The patient opens their J&J Direct account after delivery.',
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
        action: 'J&J Direct texts a second time asking the patient to sign off on the delivery. (Figma: "Group 8415".)',
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
        action: 'J&J Direct texts the patient that their refill is ready to review, with a link into the log-in chain.',
        leadsTo: [{ path: '/login', label: 'Patient taps the SMS link (carries ?next=refill)' }],
        conditions: [],
        hideStatusBar: true,
      },
      {
        path: '/refill-review',
        title: 'Refill — review and confirm',
        trigger: 'The patient finishes the log-in chain that the refill link started.',
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

// Every screen path in journey order. The sidebar uses the index to work out
// which step the patient is on and which steps are behind them.
export const FLOW_SCREEN_ORDER = FLOW_STAGES.flatMap((stage) => stage.screens.map((s) => s.path));
