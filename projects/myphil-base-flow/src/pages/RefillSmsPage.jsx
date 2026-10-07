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
        PHILRx:
        {'\n'}Hi [First name],
      </p>
      <p style={{ ...body, margin: '8px 0 0' }}>
        It&rsquo;s here — your refill is ready for:
      </p>
      <p style={{ ...body, margin: '8px 0 0' }}>
        Drugname (chemical compositions) (volume)
      </p>
      <p style={{ ...body, margin: '8px 0 0' }}>
        Keep the streak alive! Review and complete your order below:{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/refill-review'); }} style={{ color: '#2363c3', textDecoration: 'none' }}>
          https://philrx.com/refill/Yu2YquwuVw
        </a>
      </p>
    </SmsMessageScreen>
  );
}
