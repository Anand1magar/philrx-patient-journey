import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SmsMessageScreen } from '../components/SmsMessageScreen.jsx';

const body = { margin: 0, fontFamily: 'Arial, sans-serif', fontSize: 16, lineHeight: 1.25, color: '#191919', opacity: 0.9, whiteSpace: 'pre-wrap' };

// Figma: Refills section, "Overview" SMS.
export function RefillSmsPage() {
  const navigate = useNavigate();
  return (
    <SmsMessageScreen>
      <p style={body}>
        J&J Direct:
        {'\n'}Hi Patricia,
      </p>
      <p style={{ ...body, margin: '8px 0 0' }}>
        Your refill is ready for:
      </p>
      <p style={{ ...body, margin: '8px 0 0' }}>
        CAPLYTA
      </p>
      <p style={{ ...body, margin: '8px 0 0' }}>
        Review and complete your order here:{' '}
        {/* Through the log-in chain, not straight to the review: a returning
            patient has to authenticate first. ?next=refill brings them back
            here rather than to payment approval — see authNext.js. */}
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login?next=refill'); }} style={{ color: '#00587D', textDecoration: 'none' }}>
          https://jnjwithme.com/refill/Yu2YquwuVw
        </a>
      </p>
    </SmsMessageScreen>
  );
}
