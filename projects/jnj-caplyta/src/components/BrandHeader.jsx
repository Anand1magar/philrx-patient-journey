import React from 'react';
import caplytaLogo from '../assets/caplyta-logo.svg';

// CAPLYTA marketing header: brand logo + "Rx at your fingertips" tagline.
// Same layout as the PhilRx MyPhilHeader it replaces — only the logo and the
// tagline color are brand-specific. Imported as `BrandHeader as MyPhilHeader`
// at each call site so the swap is a one-line import change per screen.
// Sticks to the top of the viewport while the page scrolls.
export function BrandHeader() {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 10, width: '100%', height: 60, background: 'var(--pure)', borderBottom: '1px solid var(--fade)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 17px', boxSizing: 'border-box' }}>
      <img src={caplytaLogo} alt="CAPLYTA" style={{ height: 20 }} />
      <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: 'var(--header-tagline)' }}>Rx at your fingertips</span>
    </div>
  );
}
