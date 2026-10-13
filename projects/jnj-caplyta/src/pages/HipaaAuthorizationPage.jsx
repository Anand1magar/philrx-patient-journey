import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ds/components/forms/Button/Button.jsx';
import { SignaturePad } from '@ds/components/domain/SignaturePad/SignaturePad.jsx';
import { BrandHeader as MyPhilHeader } from '../components/BrandHeader.jsx';
import { ProgressBar } from '@ds/components/navigation/ProgressBar/ProgressBar.jsx';
import { JnjFooter as MyPhilFooter } from '../components/JnjFooter.jsx';

// Short-form authorization supplied by the client for this brand, replacing the
// base flow's long-form statement. [Client] resolves to the pharmacy name.
const HIPAA_PARAGRAPHS = [
  'By signing, I authorize my pharmacy, health plan and healthcare providers to share my health information with J&J Direct and its service providers to verify my insurance coverage, provide support services and contact me about my therapy. This authorization expires [date/event]. I may revoke it at any time in writing; revocation won’t affect actions already taken. My treatment won’t be conditioned on signing.',
];

const NEXT_ROUTE = '/savings-enrollment';

export function HipaaAuthorizationPage() {
  const navigate = useNavigate();
  return (
    <div style={{ width: '100%', minHeight: '100vh', boxSizing: 'border-box', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'var(--font-body)' }}>
      <MyPhilHeader />
      <ProgressBar percent={67} />

      <div style={{ width: '100%', flex: 1, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 16px 147px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: '36px', color: 'var(--pitch)', margin: 0 }}>HIPAA Authorization</h1>
          <p style={{ fontSize: 16, lineHeight: '24px', letterSpacing: '0.024px', color: 'var(--pitch)', margin: 0 }}>
            To assist us in processing your prescription, please review and sign the HIPAA authorization below.
          </p>
        </div>

        {/* Auto-height rather than the base flow's fixed 154px scroll box: this
            brand's authorization is one short paragraph, so a scroll box would
            leave most of it empty. */}
        <div style={{ border: '2px solid var(--fade)', borderRadius: 4, padding: 16, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {HIPAA_PARAGRAPHS.map((paragraph, i) => (
            <p key={i} style={{ fontSize: 14, lineHeight: '20px', letterSpacing: '0.035px', color: 'var(--pitch)', margin: 0, whiteSpace: 'pre-wrap' }}>{paragraph}</p>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 16, fontWeight: 700, lineHeight: '24px', letterSpacing: '0.024px', color: 'var(--pitch)', margin: 0 }}>Draw your signature in the box below</p>
          <SignaturePad height={141} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Button hierarchy="primary" fullWidth onClick={() => navigate(NEXT_ROUTE)}>Confirm</Button>
          <Button hierarchy="secondary" fullWidth onClick={() => navigate(NEXT_ROUTE)}>No thanks</Button>
        </div>
      </div>

      <MyPhilFooter />
    </div>
  );
}
