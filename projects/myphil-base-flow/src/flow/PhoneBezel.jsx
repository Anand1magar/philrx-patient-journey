import React from 'react';
import { IOSStatusBar } from '@ds/components/navigation/DeviceFrame/DeviceFrame.jsx';

const BEZEL = 12;

// A non-fullscreen phone bezel for the /flow navigator's preview pane.
// Unlike DeviceFrame (fixed, viewport-sized, its own iPhone/Desktop toggle),
// this sits inline inside a panel — same visual language, reusing
// IOSStatusBar.
export function PhoneBezel({ hostname = 'philrx.com', width, height, hideStatusBar = false, children }) {
  // iPhone 11's notch: fixed width/height regardless of frame size, unlike
  // an SE-style camera dot — Apple kept this exact notch through the 11/XR line.
  const notchWidth = Math.round(width * 0.35);

  return (
    <div style={{ position: 'relative', width: width + BEZEL * 2, background: '#101012', borderRadius: 52, padding: BEZEL, boxSizing: 'border-box', boxShadow: '0 24px 48px -16px rgba(16,18,22,0.45)' }}>
      <div className="flow-phone-screen" style={{ position: 'relative', width, height, borderRadius: 40, overflow: 'hidden', background: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: notchWidth, height: 26, background: '#000', borderRadius: '0 0 18px 18px', zIndex: 5 }} />
        {/* Pages sized with viewport units (minHeight: '100vh', etc.) or
            position:fixed (full-screen modals) target the browser window,
            not this box — pin them to the frame instead, the same fix
            DeviceFrame applies, otherwise they overflow the frame (or escape
            it entirely) and cover the whole browser instead of the mockup. */}
        <style>{'.flow-phone-screen [style*="100vh"]{min-height:100% !important}.flow-phone-screen [style*="100vw"]{max-width:100% !important}.flow-phone-screen [style*="position: fixed"]{position:absolute !important}.flow-phone-screen img,.flow-phone-screen svg{max-width:100%}.flow-phone-content::-webkit-scrollbar{display:none}'}</style>

        {!hideStatusBar && <IOSStatusBar />}

        <div style={{ flexShrink: 0, background: '#f7f7f8', padding: '6px 14px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ flex: 1, height: 34, background: '#e6e6ea', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--pitch)' }}>
            <svg width="11" height="13" viewBox="0 0 12 14" fill="none" stroke="var(--gunmetal)" strokeWidth="1.4"><rect x="1.5" y="6" width="9" height="7" rx="1.5" /><path d="M3.5 6V4a2.5 2.5 0 015 0v2" /></svg>
            {hostname}
          </span>
        </div>

        <div
          className="flow-phone-content"
          style={{ flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden', background: '#fff', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>

        <div style={{ position: 'absolute', bottom: 7, left: '50%', transform: 'translateX(-50%)', width: 120, height: 4, borderRadius: 2, background: '#000', opacity: 0.28, zIndex: 5 }} />
      </div>
    </div>
  );
}
