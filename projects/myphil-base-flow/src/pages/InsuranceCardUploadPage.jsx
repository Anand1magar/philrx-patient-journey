import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyPhilHeader } from '@ds/components/navigation/MyPhilHeader/MyPhilHeader.jsx';
import { MyPhilFooter } from '@ds/components/navigation/MyPhilFooter/MyPhilFooter.jsx';
import { CardGuideModal } from '@ds/components/domain/CardGuideModal/CardGuideModal.jsx';
import cameraIcon from '@ds/assets/icons/camera.svg';

export function InsuranceCardUploadPage() {
  const navigate = useNavigate();
  const [showCardGuide, setShowCardGuide] = useState(false);

  return (
    <div style={{ width: '100%', minHeight: '100vh', boxSizing: 'border-box', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'var(--font-body)' }}>
      <MyPhilHeader />

      <div style={{ width: '100%', flex: 1, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 28, padding: '16px 16px 120px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h1 style={{ fontSize: 16, fontWeight: 700, lineHeight: '24px', color: 'var(--pitch)', margin: 0 }}>
            Take a photo of your insurance card.
          </h1>

          <p style={{ fontSize: 16, lineHeight: '24px', color: 'var(--pitch)', margin: 0 }}>
            Please make sure the <strong>Rx BIN</strong> is visible.{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setShowCardGuide(true); }} style={{ color: 'var(--sky)', textDecoration: 'none' }}>Which card do I need?</a>
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button
            type="button"
            onClick={() => navigate('/insurance-card-review')}
            style={{ width: '100%', height: 216, boxSizing: 'border-box', background: 'none', border: '1px solid var(--fade)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
          >
            <img src={cameraIcon} alt="" style={{ width: 32, height: 32 }} />
            <span style={{ fontSize: 16, lineHeight: '24px', color: 'var(--sky)' }}>Tap to take a photo</span>
          </button>

          <p style={{ fontSize: 16, lineHeight: '24px', color: 'var(--pitch)', margin: 0 }}>
            Having trouble uploading, or don&rsquo;t have the card with you?{' '}
            <a href="#" onClick={(e) => e.preventDefault()} style={{ color: 'var(--sky)', textDecoration: 'none' }}>Click here.</a>
          </p>
        </div>

        <p style={{ fontSize: 16, lineHeight: '24px', color: 'var(--pitch)', margin: 0 }}>
          NOTE: You will get to review the pricing before you pay for your prescription.
        </p>
      </div>

      <MyPhilFooter insuranceNote />

      <CardGuideModal open={showCardGuide} onClose={() => setShowCardGuide(false)} />
    </div>
  );
}
