import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SmsMessageScreen } from '../components/SmsMessageScreen.jsx';

const body = { margin: 0, fontFamily: 'Arial, sans-serif', fontSize: 16, lineHeight: 1.25, color: '#191919', opacity: 0.9, whiteSpace: 'pre-wrap' };

// Figma: Prior Authorization section, "Overview" SMS.
export function PaSmsPage() {
  const navigate = useNavigate();
  return (
    <SmsMessageScreen>
      <p style={body}>
        [Prescription Update] Your insurance company requires a Prior Authorization for:
      </p>
      <p style={{ ...body, margin: '8px 0 0' }}>
        CAPLYTA
      </p>
      <p style={{ ...body, margin: '8px 0 0' }}>
        This requires Dr. Ethan Caldwell to submit the authorization form to your insurance company to determine your coverage. This may take a few days, depending on your doctor and insurance company.
      </p>
      <p style={{ ...body, margin: '8px 0 0' }}>
        No action is required from you. To learn more about the process, click here:{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/pa-required'); }} style={{ color: '#00587D', textDecoration: 'none' }}>
          https://jnjwithme.com/pa-faq
        </a>
      </p>
    </SmsMessageScreen>
  );
}
