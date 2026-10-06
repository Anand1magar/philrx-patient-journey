import React from 'react';
import { IOSStatusBar } from '@ds/components/navigation/DeviceFrame/DeviceFrame.jsx';

const BEZEL = 12;

// A non-fullscreen phone bezel for the /flow navigator's preview pane.
// Unlike DeviceFrame (fixed, viewport-sized, its own iPhone/Desktop toggle),
// this sits inline inside a panel — same visual language, reusing
// IOSStatusBar.
export function PhoneBezel({ hostname = 'philrx.com', width, height, children }) {
  const notchWidth = Math.round(Math.min(130, Math.max(90, width * 0.28)));

  return (
    <div style={{ width: width + BEZEL * 2, background: '#101012', borderRadius: 52, padding: BEZEL, boxSizing: 'border-box', boxShadow: '0 24px 48px -16px rgba(16,18,22,0.45)' }}>
      <div className="flow-phone-screen" style={{ position: 'relative', width, height, borderRadius: 40, overflow: 'hidden', background: '#fff', display: 'flex', flexDirection: 'column' }}>
        {/* Pages sized with viewport units (minHeight: '100vh', etc.) target the
            browser window, not this box — pin them to the frame instead, the
            same fix DeviceFrame applies, otherwise they overflow the frame and
            create a second, nested scroll region. */}
        <style>{'.flow-phone-screen [style*="100vh"]{min-height:100% !important}.flow-phone-screen [style*="100vw"]{max-width:100% !important}.flow-phone-screen img,.flow-phone-screen svg{max-width:100%}.flow-phone-content::-webkit-scrollbar{display:none}'}</style>

        <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: notchWidth, height: 28, background: '#000', borderRadius: 16, zIndex: 5 }} />

        <IOSStatusBar />

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
