import React from 'react';
import jnjLogo from '../assets/jnj-logo.svg';

// Custom Johnson & Johnson footer for the CAPLYTA brand, replacing the PhilRx
// MyPhilFooter across every screen.
//
// Figma: "4Q25 - 1Q26 Johnson & Johnson" (vQFSUrguJEaQ8QhkAfGpM3), node 1939:5717.
// The design's spacing values are the scaled frame's (20.48 / 40.96 / 27.307 /
// 34.133 / 13.653); rounded here to the whole pixels the rest of this app uses.
// The design's "Johnson Text" face isn't licensed into this project — body text
// falls back to the base typography default, per the brand spec.
//
// `insuranceNote` is carried over from MyPhilFooter: the payment and
// prescription screens pass it to surface the "Insurance questions?" block,
// which sits above the J&J legal content rather than replacing it.
export function JnjFooter({ insuranceNote = false }) {
  const body = { margin: 0, fontSize: 14, lineHeight: '20px', color: 'var(--pitch)', wordBreak: 'break-word' };
  const link = { ...body, color: 'var(--pitch)', textDecoration: 'underline' };

  return (
    <div style={{ width: '100%', boxSizing: 'border-box', background: 'var(--pure)', borderTop: '0.5px solid var(--base)', fontFamily: 'var(--font-body)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 28, padding: '28px 20px 40px' }}>
      {insuranceNote && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--pitch)' }}>Insurance questions?</span>
          <span style={{ fontSize: 14, lineHeight: '20px', color: 'var(--pitch)' }}>
            Contact your insurance company. You can find their number on the back of your insurance card.
          </span>
        </div>
      )}

      <img src={jnjLogo} alt="Johnson &amp; Johnson" style={{ display: 'block', width: '100%', maxWidth: 279, height: 'auto' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 32, width: '100%' }}>
        <p style={body}>
          This site is published by PHIL Inc., which is solely responsible for its contents. The material on this
          site is intended only as informational or as an educational aid and it is not intended to be taken as
          medical advice. The ultimate responsibility for patient care resides with a healthcare professional.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%' }}>
          <p style={body}>
            This information is intended for the use of patients and care partners in the United States and Puerto
            Rico only. Laws, regulatory requirements, and medical practices for pharmaceutical products vary from
            market to market. The Prescribing Information included here may not be appropriate for use outside the
            United States and Puerto Rico.
          </p>
          <p style={body}>Last updated October 2026 cp-554138v3</p>
          <a href="#" onClick={(e) => e.preventDefault()} style={link}>Contact us</a>
        </div>

        {/* Figma draws this divider as a 280px line asset; the design system
            already expresses hairline rules as a border, so use that. */}
        <div style={{ width: '100%', maxWidth: 280, borderTop: '1px solid var(--fade)' }} />

        <a href="#" onClick={(e) => e.preventDefault()} style={link}>Privacy Policy</a>

        <p style={body}>&copy; Johnson &amp; Johnson and its affiliates 2026</p>
      </div>
    </div>
  );
}
