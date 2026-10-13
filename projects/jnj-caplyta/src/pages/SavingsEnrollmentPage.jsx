import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ds/components/forms/Button/Button.jsx';
import { DeclineEnrollmentModal } from '@ds/components/domain/DeclineEnrollmentModal/DeclineEnrollmentModal.jsx';
import { BrandHeader as MyPhilHeader } from '../components/BrandHeader.jsx';
import { ProgressBar } from '@ds/components/navigation/ProgressBar/ProgressBar.jsx';
import { JnjFooter as MyPhilFooter } from '../components/JnjFooter.jsx';

// CAPLYTA withMe Savings Program terms, supplied by the client.
const TERMS_TEXT = `The CAPLYTA withMe Savings Program provides medicine cost support for eligible patients.

•   Eligible patients may pay as little as $0 for 30-, 60-, or 90-day prescriptions. Maximum program benefit per calendar year shall apply. Patient out-of-pocket expense will vary based on the patient’s health plan and coverage details.

•   Eligible patients whose insurance does not cover CAPLYTA or whose coverage restrictions have not been met pay as little as $0 on the first fill for 30-day supply, per lifetime.

•   Eligible, commercially insured patients who are taking CAPLYTA as an adjunctive or add-on treatment for Major Depressive Disorder pay as little as $0 per prescription fill for a generic antidepressant.`;

const NEXT_ROUTE = '/enrollment-success';

export function SavingsEnrollmentPage() {
  const navigate = useNavigate();
  const [showDeclineModal, setShowDeclineModal] = useState(false);

  return (
    <div style={{ width: '100%', minHeight: '100vh', boxSizing: 'border-box', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'var(--font-body)' }}>
      <MyPhilHeader />
      <ProgressBar percent={83} />

      <div style={{ width: '100%', flex: 1, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 16px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: '36px', color: 'var(--pitch)', margin: 0 }}>Terms and Conditions</h1>
          <p style={{ fontSize: 16, lineHeight: '24px', letterSpacing: '0.024px', color: 'var(--pitch)', margin: 0 }}>
            Join the thousands of patients saving by enrolling in the CAPLYTA withMe Savings Program.* Agree to the terms and conditions below and save.
          </p>
        </div>

        {/* Taller than the base flow's 180px: this brand's terms run to three
            bullets, and at 180 the box reads as truncated copy rather than a
            scrollable terms list. */}
        <div style={{ height: 260, overflowY: 'auto', border: '2px solid var(--fade)', borderRadius: 4, padding: 16, boxSizing: 'border-box' }}>
          <p style={{ fontSize: 14, lineHeight: '20px', letterSpacing: '0.035px', color: 'var(--pitch)', margin: 0, whiteSpace: 'pre-wrap' }}>{TERMS_TEXT}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Button hierarchy="primary" fullWidth onClick={() => navigate(NEXT_ROUTE)}>Agree and enroll</Button>
          <Button hierarchy="secondary" fullWidth onClick={() => setShowDeclineModal(true)}>Decline enrollment</Button>
        </div>

        <p style={{ fontSize: 12, lineHeight: '24px', letterSpacing: '0.018px', color: 'var(--gunmetal)', margin: 0 }}>*Eligibility and savings depend on your insurance coverage.</p>
      </div>

      <MyPhilFooter />

      <DeclineEnrollmentModal
        open={showDeclineModal}
        onClose={() => setShowDeclineModal(false)}
        onEnroll={() => { setShowDeclineModal(false); navigate(NEXT_ROUTE); }}
        onDecline={() => setShowDeclineModal(false)}
      />
    </div>
  );
}
