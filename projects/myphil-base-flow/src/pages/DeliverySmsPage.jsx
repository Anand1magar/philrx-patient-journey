import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SmsMessageScreen } from '../components/SmsMessageScreen.jsx';

const body = { margin: 0, fontFamily: 'Arial, sans-serif', fontSize: 16, lineHeight: 1.25, color: '#191919', opacity: 0.9, whiteSpace: 'pre-wrap' };

// Figma: Shipping & Delivery section, the delivered-confirmation SMS.
export function DeliverySmsPage() {
  const navigate = useNavigate();
  return (
    <SmsMessageScreen>
      <p style={body}>
        PHILRx:
        {'\n'}Hi [First name],
      </p>
      <p style={{ ...body, margin: '8px 0 0' }}>
        It&rsquo;s here! Your prescription was delivered on [delivered date]. Questions? We&rsquo;re one click away{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/delivery-confirmation-required'); }} style={{ color: '#2363c3', textDecoration: 'underline' }}>
          here
        </a>.
      </p>
    </SmsMessageScreen>
  );
}
