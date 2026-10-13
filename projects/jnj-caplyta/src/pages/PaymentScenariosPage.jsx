import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ds/components/forms/Button/Button.jsx';
import { COVERAGES } from '../paymentCoverages.js';

// This is a navigator-only landing page, not a screen a patient ever sees —
// in the real product, "View your cost" lands on exactly one of these, decided
// by the coverage on file. It exists so reviewers can jump into any of the four
// coverage outcomes. See flowData.js's isLandingPage flag, which tells
// FlowPreviewPane to render this full-width instead of inside the phone bezel,
// and drop the patient-app chrome (BrandAppHeader / JnjFooter) that would
// otherwise make it look like one of those screens.
export function PaymentScenariosPage() {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%', minHeight: '100vh', boxSizing: 'border-box', background: '#fff', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', boxSizing: 'border-box', padding: '48px 40px 64px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--gunmetal)', margin: 0 }}>Flow navigator — review tool</p>
          <h1 style={{ fontSize: 28, fontWeight: 700, lineHeight: '36px', color: 'var(--pitch)', margin: 0 }}>Payment approval — coverage types</h1>
          <p style={{ fontSize: 16, lineHeight: '24px', color: 'var(--gunmetal)', margin: 0, maxWidth: 640 }}>
            Not a screen a patient ever sees. In the real product, &ldquo;View your cost&rdquo; lands on exactly one of
            these, decided by the coverage on file — this page lets you pick which one to preview below.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {COVERAGES.map((coverage) => (
            <div
              key={coverage.id}
              style={{ boxSizing: 'border-box', background: 'var(--paper)', border: '1px solid var(--fade)', borderRadius: 8, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--pitch)', margin: 0 }}>{coverage.name}</p>
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--sky)' }}>{coverage.total}</span>
                  {coverage.papBanner && (
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--sky)', background: 'var(--sky-tint)', border: '1px solid var(--sky-disabled)', borderRadius: 2, padding: '2px 6px' }}>PAP</span>
                  )}
                </div>
                <p style={{ fontSize: 14, lineHeight: '20px', color: 'var(--gunmetal)', margin: 0 }}>{coverage.description}</p>
              </div>
              <Button hierarchy="primary" fullWidth onClick={() => navigate(coverage.path)}>Preview this coverage</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
