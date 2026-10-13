import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SmsMessageScreen } from '../components/SmsMessageScreen.jsx';

export function CheckoutSmsPage() {
  const navigate = useNavigate();
  return (
    <SmsMessageScreen>
      <p style={{ margin: 0, fontFamily: 'Arial, sans-serif', fontSize: 16, lineHeight: 1.25, color: '#191919', opacity: 0.9, whiteSpace: 'pre-wrap' }}>
        J&J Direct: Your prescription is ready to ship:
        {'\n\n'}- CAPLYTA
      </p>
      <p style={{ margin: '8px 0 0', fontFamily: 'Arial, sans-serif', fontSize: 16, lineHeight: 1.25, color: '#191919', opacity: 0.9, whiteSpace: 'pre-wrap' }}>
        Complete your order:{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ color: '#00587D', textDecoration: 'none' }}>
          https://jnjwithme.com/checkout/Yu2YquwuVw
        </a>
      </p>
    </SmsMessageScreen>
  );
}
