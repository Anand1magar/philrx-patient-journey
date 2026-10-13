import { useSearchParams } from 'react-router-dom';

// The log-in chain — /login -> (/confirm-identity) -> /otp-delivery ->
// /otp-verify — serves two entry points: the checkout SMS, which ends on the
// payment-approval scenarios, and the refill SMS, which has to come back to the
// refill review. Nothing is persisted across routes in this prototype, so the
// entry point travels as a ?next= query param that every screen in the chain
// forwards and only /otp-verify consumes.
//
// Same mechanism as ?combined=1 on /second-chance-enrollment and /dual-pricing,
// and like those it keeps each variant a distinct path the /flow navigator can
// document and deep-link.
//
// Plain .js, so no JSX in here — @vitejs/plugin-react only transforms .jsx.

// Where /otp-verify's "Confirm" lands, keyed by ?next=.
const DESTINATION_BY_NEXT = {
  refill: '/refill-review',
};

// No ?next= — the checkout-SMS path — keeps the original destination.
const DEFAULT_DESTINATION = '/payment-scenarios';

export function useAuthNext() {
  const [searchParams] = useSearchParams();
  const requested = searchParams.get('next');
  // Unknown values collapse to null, so a stray ?next=whatever can never
  // produce a path the flow navigator has no entry for.
  const next = requested && DESTINATION_BY_NEXT[requested] ? requested : null;
  return {
    // '' or '?next=refill' — append to the next path in the chain.
    suffix: next ? `?next=${next}` : '',
    destination: next ? DESTINATION_BY_NEXT[next] : DEFAULT_DESTINATION,
  };
}
