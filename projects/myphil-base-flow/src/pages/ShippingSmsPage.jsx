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
        PHILRx: It&rsquo;s on the way! Your prescription just shipped:
        {'\n'}- Drugname (chemical compositions) (volume)
      </p>
      <p style={{ ...body, margin: '8px 0 0' }}>
        Follow along here:{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/shipped'); }} style={{ color: '#2363c3', textDecoration: 'none' }}>
          https://philrx.com/track/Yu2YquwuVw
        </a>
      </p>
    </SmsMessageScreen>
  );
}
