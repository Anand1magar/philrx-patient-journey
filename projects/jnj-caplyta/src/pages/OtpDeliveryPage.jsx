import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ds/components/forms/Button/Button.jsx';
import { Radio } from '@ds/components/forms/Radio/Radio.jsx';
import { BrandAppHeader } from '../components/BrandAppHeader.jsx';
import { JnjFooter as MyPhilFooter } from '../components/JnjFooter.jsx';
import { useAuthNext } from '../authNext.js';

// Text message first and pre-selected: it's the recommended channel on the
// contact-information step, so the code screen defaults to matching it.
// OtpVerifyPage's copy names this channel — change both together.
const DELIVERY_OPTIONS = [
  { id: 'text', label: 'Text message', detail: '(***)***-1301' },
  { id: 'email', label: 'Email', detail: '****isa@gmail.com' },
];

const DEFAULT_DELIVERY_METHOD = 'text';

export function OtpDeliveryPage() {
  const navigate = useNavigate();
  const [method, setMethod] = useState(DEFAULT_DELIVERY_METHOD);
  // ?next=refill when this chain started from the refill SMS; forwarded on.
  const { suffix } = useAuthNext();

  return (
    <div style={{ width: '100%', minHeight: '100vh', boxSizing: 'border-box', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'var(--font-body)' }}>
      <BrandAppHeader />

      <div style={{ width: '100%', flex: 1, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 16px 120px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: '36px', color: 'var(--pitch)', margin: 0 }}>Where should we send your one-time code?</h1>

        <p style={{ fontSize: 16, lineHeight: '24px', color: 'var(--pitch)', margin: 0 }}>
          Please choose where you&rsquo;d like to receive your 6-digit code.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DELIVERY_OPTIONS.map((option) => (
            <Radio
              key={option.id}
              name="otp-method"
              label={
                <>
                  {option.label}{' '}
                  <span style={{ color: 'var(--sky)', fontWeight: 700 }}>{option.detail}</span>
                </>
              }
              checked={method === option.id}
              onChange={() => setMethod(option.id)}
            />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Button hierarchy="primary" fullWidth onClick={() => navigate('/otp-verify' + suffix)}>Send Code</Button>
          <p style={{ fontSize: 16, lineHeight: '24px', color: 'var(--gunmetal)', margin: 0 }}>
            Message &amp; data rates may apply if you select to receive your code by text message.
          </p>
        </div>
      </div>

      <MyPhilFooter />
    </div>
  );
}
