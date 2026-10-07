import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SmsMessageScreen } from '../components/SmsMessageScreen.jsx';

const body = { margin: 0, fontFamily: 'Arial, sans-serif', fontSize: 16, lineHeight: 1.25, color: '#191919', opacity: 0.9, whiteSpace: 'pre-wrap' };

// Figma: Prior Authorization section, Msg ID STD25.1 "PA Denied".
export function PaDeniedSmsPage() {
  const navigate = useNavigate();
  return (
    <SmsMessageScreen>
      <p style={body}>
        [Prescription Update] Your insurance company denied the Prior Authorization for:
      </p>
      <p style={{ ...body, margin: '8px 0 0' }}>
        Drugname (chemical compositions) (volume)
      </p>
      <p style={{ ...body, margin: '8px 0 0' }}>
        We&rsquo;ll work to find and apply any manufacturer offers your prescription is eligible for. We&rsquo;ll let you know once your cost is ready. Visit your MyPhil account for updates:{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/pa-denied'); }} style={{ color: '#2363c3', textDecoration: 'none' }}>
          https://philrx.com/my-prescriptions
        </a>
      </p>
    </SmsMessageScreen>
  );
}
