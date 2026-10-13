// The four payment-approval variants for CAPLYTA. Payment approval is one
// screen; coverage type is what changes — the price, whether the manufacturer
// coupon is doing any work, and whether the patient-assistance (PAP) banner
// shows.
//
// Each is its own path so the /flow navigator can list and deep-link all four,
// the same reasoning that gives every prescription status its own route.
//
// The $450 list price and the $100 commercial-uncovered price are placeholders
// the client supplied; swap them when real pricing lands.
//
// Plain .js, so no JSX in here — @vitejs/plugin-react only transforms .jsx.

const LIST_PRICE = '$450';

export const COVERAGES = [
  {
    id: 'commercial-covered',
    path: '/payment-commercial-covered',
    name: 'Commercial — covered',
    description: 'Commercial insurance covers CAPLYTA. The manufacturer coupon brings the patient’s share to $0.',
    priceLine: '30 Day Supply for $0',
    total: '$0.00',
    // Covered outright, so there is no "was $X" comparison to draw and no
    // percentage worth badging — the note carries the message instead.
    listPrice: null,
    discountLabel: null,
    note: 'Covered by your insurance, with the manufacturer coupon applied.',
    papBanner: false,
  },
  {
    id: 'commercial-uncovered',
    path: '/payment-commercial-uncovered',
    name: 'Commercial — not covered',
    description: 'Commercial insurance does not cover CAPLYTA. The manufacturer coupon discounts the cash price.',
    priceLine: '30 Day Supply with Coupon for $100',
    total: '$100.00',
    listPrice: LIST_PRICE,
    discountLabel: '78% OFF',
    note: null,
    papBanner: false,
  },
  {
    id: 'uninsured',
    path: '/payment-uninsured',
    name: 'Uninsured',
    description: 'No insurance on file. The patient pays the cash price and is pointed at the J&J patient assistance program.',
    priceLine: `30 Day Supply for ${LIST_PRICE}`,
    total: '$450.00',
    listPrice: null,
    discountLabel: null,
    note: null,
    papBanner: true,
  },
  {
    id: 'government',
    path: '/payment-government',
    name: 'Government-sponsored',
    description: 'Medicare, Medicaid or another government plan. Manufacturer coupons cannot be applied, so the patient is pointed at the J&J patient assistance program.',
    priceLine: `30 Day Supply for ${LIST_PRICE}`,
    total: '$450.00',
    listPrice: null,
    discountLabel: null,
    // Why the coupon is unavailable here — the one thing that would otherwise
    // read as a bug on this screen.
    note: 'Manufacturer coupons cannot be used with government-sponsored insurance.',
    papBanner: true,
  },
];

export const COVERAGE_BY_ID = Object.fromEntries(COVERAGES.map((c) => [c.id, c]));

export const DEFAULT_COVERAGE = COVERAGES[0].id;

// The J&J patient assistance program the PAP banner links out to.
export const PAP_URL = 'https://www.portal.jnjwithme.com/patient-assistance';
