import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ds/components/forms/Button/Button.jsx';

const SCENARIOS = [
  {
    id: 'payment',
    name: 'Payment',
    route: '/payment',
    description: 'Your best price is already found. Review the order summary, then step through shipping, payment and signature.',
  },
  {
    id: 'second-chance-banner',
    name: 'Second chance enrollment — banner',
    route: '/second-chance-enrollment',
    description: 'A manufacturer offer banner sits above the insurance price. Enrolling opens the savings terms; declining opens the “Why pay full price?” prompt.',
  },
  {
    id: 'second-chance-banner-combined',
    name: 'Second chance enrollment — banner (HIPAA + coupon combined)',
    route: '/second-chance-enrollment?combined=1',
    description: 'The banner flow, but enrolling opens one screen with the eligibility and HIPAA checkboxes plus the signature, rather than a terms scroll-box.',
  },
  {
    id: 'second-chance-dual-pricing',
    name: 'Second chance enrollment — dual pricing',
    route: '/dual-pricing',
    description: 'Two prices side by side — final price versus manufacturer offer — chosen before checkout begins.',
  },
  {
    id: 'second-chance-dual-pricing-combined',
    name: 'Second chance enrollment — dual pricing (HIPAA + coupon combined)',
    route: '/dual-pricing?combined=1',
    description: 'Dual pricing where choosing the manufacturer offer expands the order summary to hold the consent checkboxes and signature inline.',
  },
  {
    id: 'refills',
    name: 'Refills',
    route: '/refill-review',
    description: 'A returning patient reviews and confirms a refill on one screen, using the card already on file.',
  },
];

// This is a navigator-only landing page, not a screen a patient ever sees —
// in the real product, "View your cost" lands on exactly one of these
// outcomes. It exists so reviewers can jump into any of the equivalent
// payment-approval scenarios Figma documents. See flowData.js's
// isLandingPage flag, which tells FlowPreviewPane to render this full-width
// instead of inside the phone bezel, and drop the patient-app chrome
// (PhilRxAppHeader / MyPhilFooter) that would otherwise make it look like
// one of those screens.
export function PaymentScenariosPage() {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%', minHeight: '100vh', boxSizing: 'border-box', background: '#fff', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', boxSizing: 'border-box', padding: '48px 40px 64px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--gunmetal)', margin: 0 }}>Flow navigator — review tool</p>
          <h1 style={{ fontSize: 28, fontWeight: 700, lineHeight: '36px', color: 'var(--pitch)', margin: 0 }}>Payment approval scenarios</h1>
          <p style={{ fontSize: 16, lineHeight: '24px', color: 'var(--gunmetal)', margin: 0, maxWidth: 640 }}>
            Not a screen a patient ever sees. In the real product, "View your cost" lands on exactly one outcome — this page lets you pick which one to preview below.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {SCENARIOS.map((scenario) => (
            <div
              key={scenario.id}
              style={{ boxSizing: 'border-box', background: 'var(--paper)', border: '1px solid var(--fade)', borderRadius: 8, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--pitch)', margin: 0 }}>{scenario.name}</p>
                <p style={{ fontSize: 14, lineHeight: '20px', color: 'var(--gunmetal)', margin: 0 }}>{scenario.description}</p>
              </div>
              <Button hierarchy="primary" fullWidth onClick={() => navigate(scenario.route)}>Preview this scenario</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
