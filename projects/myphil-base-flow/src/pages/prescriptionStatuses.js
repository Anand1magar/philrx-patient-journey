// The MyPhil "My prescriptions" screen is one layout the patient returns to
// over and over — Figma draws it seven times, once per order status, changing
// only the status headline, the explanatory copy, and the buttons. Rather than
// seven near-identical page components, MyPrescriptionsPage renders whichever
// entry below its route maps to (see pageRegistry.js).
//
// Copy is lifted verbatim from the Figma sections "Prior Authorization",
// "Payment", and "Shipping & Delivery". Drug name and dates stay as the
// placeholders the rest of this app uses ("Drugname (chemical compositions)
// (volume)", "XX/XX/XX") rather than Figma's sample brands — Figma uses
// WINLEVI in the PA frames and VEOZAH in the shipping frames, which would read
// as two different prescriptions in one continuous walkthrough.

// The payment/PA statuses carry the full cost-explainer FAQ; the shipping and
// delivery statuses switch to a shorter list with a "See more" link.
export const FAQ_FULL = [
  'Why do I have a high copay?',
  'Why has my cost increased from my last fill?',
  "Why can't I use some manufacturer offers with government-sponsored insurance?",
  'What is a Cash Price?',
  'What is a Copay?',
  'What is a Deductible?',
  'Why am I getting a 30-day supply instead of a 90-day supply?',
];

export const FAQ_SHORT = [
  "Why can't I see my prescription in my MyPhil account?",
  'How do I get my receipt?',
];

export const PRESCRIPTION_STATUSES = {
  'pa-required': {
    headline: 'Prior Authorization - required by your insurance',
    paragraphs: [
      "Your insurance company requires a Prior Authorization. We'll work with your doctor to get the Prior Authorization form submitted.",
    ],
    notes: [
      'Prior Authorization is a form needed by your insurance company to decide if they will cover your prescription cost.',
      'No action is required from you.',
    ],
    // The PA outcome is the one real fork in the journey. The button walks
    // the approved branch so the linear click-through keeps moving; the
    // denied branch is reachable from the /flow navigator, which lists both
    // (see flowData.js).
    actions: [{ label: 'Manage your prescription', hierarchy: 'primary', to: '/pa-approved-sms' }],
    faq: FAQ_FULL,
  },

  'pa-approved': {
    headline: 'Prior Authorization approved - continue processing for your lowest cost',
    paragraphs: [
      "Good news! The Prior Authorization was approved. We'll continue processing to get your lowest cost.",
    ],
    notes: [],
    actions: [{ label: 'Manage your prescription', hierarchy: 'primary', to: '/finalizing-cost' }],
    faq: FAQ_FULL,
  },

  'pa-denied': {
    headline: 'Continue processing for your lowest cost',
    paragraphs: [
      'Your insurance company denied the Prior Authorization.',
      "We'll work to find and apply any manufacturer offer your prescription may be eligible for. We'll let you know once your cost is ready.",
    ],
    notes: [
      'Contact your insurance company for details about your prescription coverage. You can find their number on the back of your insurance card.',
    ],
    actions: [{ label: 'Manage your prescription', hierarchy: 'primary', to: '/finalizing-cost' }],
    faq: FAQ_FULL,
  },

  'finalizing-cost': {
    headline: 'Finalizing your cost',
    paragraphs: [],
    notes: ["We'll let you know if anything else is needed."],
    actions: [{ label: 'Manage your prescription', hierarchy: 'primary', to: '/checkout-sms' }],
    faq: FAQ_FULL,
  },

  // The original payment-approval status. Keeps the divider between the
  // headline and the italic note that this screen shipped with, which the
  // Figma PA frames don't have.
  'cost-ready': {
    headline: 'Your prescription cost is ready to view',
    paragraphs: [],
    notes: ['Your payment won’t be charged until you approve your prescription cost.'],
    dividerBeforeNotes: true,
    actions: [
      { label: 'View your cost', hierarchy: 'primary', to: '/payment-scenarios' },
      { label: 'Refill', hierarchy: 'secondary', to: '/refill-review' },
      { label: 'Manage your prescription', hierarchy: 'secondary' },
    ],
    faq: FAQ_FULL,
  },

  shipped: {
    headline: 'Shipped on [day, mm/dd]',
    paragraphs: [],
    notes: [],
    actions: [
      { label: 'Track your prescription', hierarchy: 'primary', to: '/delivery-sms' },
      { label: 'Manage your prescription', hierarchy: 'secondary' },
    ],
    faq: FAQ_SHORT,
    faqSeeMore: true,
  },

  'delivery-confirmation-required': {
    headline: 'Delivery confirmation required',
    paragraphs: [
      'Your insurance company requires your signature to confirm that your prescription was delivered.',
      'Your next refill is scheduled to start processing on [12/25].',
    ],
    notes: [],
    actions: [
      { label: 'Confirm delivery', hierarchy: 'primary', to: '/delivery-confirmation' },
      { label: 'Manage your prescription', hierarchy: 'secondary' },
    ],
    faq: FAQ_SHORT,
    faqSeeMore: true,
  },

  // Where the plain "it's here" SMS lands. When the insurer wants signed
  // proof of receipt a second SMS follows, which is why this continues to
  // the signature request rather than straight to the refill.
  delivered: {
    headline: 'Delivered on [day, mm/dd]',
    paragraphs: ['Your next refill is scheduled to start processing on [mm/dd].'],
    notes: [],
    actions: [{ label: 'Manage your prescription', hierarchy: 'primary', to: '/delivery-signature-sms' }],
    faq: FAQ_SHORT,
    faqSeeMore: true,
  },
};
