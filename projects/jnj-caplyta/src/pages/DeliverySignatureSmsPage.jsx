import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SmsMessageScreen } from '../components/SmsMessageScreen.jsx';

const body = { margin: 0, fontFamily: 'Arial, sans-serif', fontSize: 16, lineHeight: 1.25, color: '#191919', opacity: 0.9, whiteSpace: 'pre-wrap' };

// Figma: Shipping & Delivery section, "Group 8415". A second delivery text,
// sent only when the insurer wants signed proof of receipt — the plain
// "it's here" SMS goes out either way.
export function DeliverySignatureSmsPage() {
  const navigate = useNavigate();
  return (
    <SmsMessageScreen>
      <p style={body}>J&J Direct: Your prescription was delivered.</p>
      <p style={{ ...body, margin: '8px 0 0' }}>
        Your insurance company requires your signature to confirm receipt. Sign here:{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/delivery-confirmation-required'); }} style={{ color: '#00587D', textDecoration: 'none' }}>
          https://jnjwithme.com/confirm-delivery/Yu2YquwuVw
        </a>
      </p>
    </SmsMessageScreen>
  );
}
