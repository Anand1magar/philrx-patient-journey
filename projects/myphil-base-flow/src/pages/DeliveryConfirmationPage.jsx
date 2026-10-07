import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ds/components/forms/Button/Button.jsx';
import { Icon } from '@ds/assets/icons/Icon.jsx';
import { PhilRxAppHeader } from '../components/PhilRxAppHeader.jsx';
import { MyPhilFooter } from '@ds/components/navigation/MyPhilFooter/MyPhilFooter.jsx';

// Figma: Shipping & Delivery section, "N. Delivery Confirmation" plus the
// "L. Delivery Info" signature modal it opens. The signature box is a static
// mock of the Figma frame — same as the signature step in PaymentAccordions,
// it isn't a real drawing surface.
export function DeliveryConfirmationPage() {
  const navigate = useNavigate();
  const [signing, setSigning] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', boxSizing: 'border-box', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'var(--font-body)' }}>
      <PhilRxAppHeader active="rx" />

      <div style={{ width: '100%', flex: 1, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 16px 40px' }}>
        {/* Figma draws a package glyph inside a thin circle. The icon set's
            ready-made MyPhil64PackageCircle can't be used: every one of its
            paths is currentColor, including a full-bleed background plate, so
            tinting it fills the whole square. MyPhil24Box is a clean glyph, so
            the circle is drawn here instead. */}
        <div
          style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid var(--foliage)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <Icon name="MyPhil24Box" size={32} style={{ color: 'var(--foliage)' }} />
        </div>

        <h1 style={{ fontSize: 20, fontWeight: 700, lineHeight: '28px', color: 'var(--pitch)', margin: 0 }}>
          Your prescriptions were delivered today!
        </h1>

        <div style={{ width: '100%', boxSizing: 'border-box', border: '1px dashed var(--fade)', borderRadius: 4, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ fontSize: 14, color: 'var(--gunmetal)', margin: 0 }}>Medication</p>
          <p style={{ fontSize: 16, color: 'var(--pitch)', margin: 0, paddingLeft: 16 }}>Drugname (chemical compositions) (volume)</p>
        </div>

        <p style={{ fontSize: 16, lineHeight: '24px', color: 'var(--pitch)', margin: 0 }}>
          Your insurance requires that you provide your signature to confirm receipt of your prescriptions.
        </p>

        <Button hierarchy="primary" fullWidth onClick={() => setSigning(true)}>Click to sign</Button>

        <p style={{ fontSize: 14, color: 'var(--pitch)', margin: 0 }}>
          Missing delivery?{' '}
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-link)' }}>Contact your courier</a>
        </p>
      </div>

      <MyPhilFooter />

      {signing && (
        <div
          style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'rgba(10,10,10,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, boxSizing: 'border-box' }}
          onClick={() => setSigning(false)}
        >
          <div
            style={{ width: '100%', maxWidth: 560, boxSizing: 'border-box', background: '#fff', borderRadius: 8, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--pitch)', margin: 0 }}>Draw your signature in the box below:</p>
              <button
                type="button"
                onClick={() => setSigning(false)}
                aria-label="Close"
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, lineHeight: 1, color: 'var(--gunmetal)', padding: 0 }}
              >
                &times;
              </button>
            </div>

            <div style={{ position: 'relative', width: '100%', height: 140, border: '1px solid var(--fade)', borderRadius: 4, boxSizing: 'border-box' }}>
              <div style={{ position: 'absolute', left: 16, right: 16, bottom: 44, borderTop: '1px dashed var(--fade)' }} />
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{ position: 'absolute', right: 16, bottom: 12, fontSize: 14, color: 'var(--text-link)' }}
              >
                Clear
              </a>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <Button hierarchy="primary" onClick={() => navigate('/delivered')}>Confirm delivery</Button>
              <p style={{ fontSize: 14, color: 'var(--pitch)', margin: 0 }}>
                Missing delivery?
                <br />
                <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--text-link)' }}>Contact your courier</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
