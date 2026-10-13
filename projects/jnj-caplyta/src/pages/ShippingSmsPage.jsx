import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SmsMessageScreen } from '../components/SmsMessageScreen.jsx';

const body = { margin: 0, fontFamily: 'Arial, sans-serif', fontSize: 16, lineHeight: 1.25, color: '#191919', opacity: 0.9, whiteSpace: 'pre-wrap' };

// Figma: Shipping & Delivery section, "Overview" SMS.
export function ShippingSmsPage() {
  const navigate = useNavigate();
  return (
    <SmsMessageScreen>
      <p style={body}>
        J&J Direct: Your prescription has shipped:
        {'\n'}- CAPLYTA
      </p>
      <p style={{ ...body, margin: '8px 0 0' }}>
        Track your delivery here:{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/shipped'); }} style={{ color: '#00587D', textDecoration: 'none' }}>
          https://jnjwithme.com/track/Yu2YquwuVw
        </a>
      </p>
    </SmsMessageScreen>
  );
}
