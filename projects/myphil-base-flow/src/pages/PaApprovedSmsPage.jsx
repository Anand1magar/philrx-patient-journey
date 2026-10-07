import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SmsMessageScreen } from '../components/SmsMessageScreen.jsx';

const body = { margin: 0, fontFamily: 'Arial, sans-serif', fontSize: 16, lineHeight: 1.25, color: '#191919', opacity: 0.9, whiteSpace: 'pre-wrap' };

// Figma: Prior Authorization section, Msg ID STD160 "PA Approved".
export function PaApprovedSmsPage() {
  const navigate = useNavigate();
  return (
    <SmsMessageScreen>
      <p style={body}>
        [Prescription Update] Good news! Your insurance company approved the Prior Authorization and is covering your prescription for:
      </p>
      <p style={{ ...body, margin: '8px 0 0' }}>
        Drugname (chemical compositions) (volume)
      </p>
      <p style={{ ...body, margin: '8px 0 0' }}>
        We&rsquo;ll let you know once your cost is finalized and ready for you to view. Visit your MyPhil account for updates:{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/pa-approved'); }} style={{ color: '#2363c3', textDecoration: 'none' }}>
          https://philrx.com/my-prescriptions
        </a>
      </p>
    </SmsMessageScreen>
  );
}
