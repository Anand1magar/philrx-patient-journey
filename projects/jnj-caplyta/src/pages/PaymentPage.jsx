import React, { useState } from 'react';
import { Button } from '@ds/components/forms/Button/Button.jsx';
import { Icon } from '@ds/assets/icons/Icon.jsx';
import { BrandAppHeader } from '../components/BrandAppHeader.jsx';
import { JnjFooter as MyPhilFooter } from '../components/JnjFooter.jsx';
import { PaymentAccordions } from '../components/PaymentAccordions.jsx';
import { COVERAGE_BY_ID, DEFAULT_COVERAGE, PAP_URL } from '../paymentCoverages.js';

export function PaymentPage({ coverage = DEFAULT_COVERAGE }) {
  const plan = COVERAGE_BY_ID[coverage] ?? COVERAGE_BY_ID[DEFAULT_COVERAGE];
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [openSection, setOpenSection] = useState(null);

  return (
    <div style={{ width: '100%', minHeight: '100vh', boxSizing: 'border-box', background: 'var(--paper)', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'var(--font-body)' }}>
      <BrandAppHeader />

      <div style={{ width: '100%', flex: 1, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 16px 60px' }}>
        <div style={{ width: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid var(--fade)', borderRadius: 4, padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button
            type="button"
            onClick={() => setSummaryOpen((o) => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)' }}
          >
            <p style={{ flex: 1, fontSize: 16, fontWeight: 700, color: 'var(--pitch)', margin: 0 }}>Order summary</p>
            <Icon name={summaryOpen ? 'ArrowDropUpStyleFilled' : 'ArrowDropDownStyleFilled'} size={24} style={{ color: 'var(--pitch)', flexShrink: 0 }} />
          </button>

          {summaryOpen && (
          <React.Fragment>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--pitch)', margin: 0 }}>CAPLYTA</p>
            <p style={{ fontSize: 14, color: 'var(--pitch)', margin: 0 }}>30-day supply</p>
          </div>

          <div style={{ borderTop: '1px solid var(--fade)', width: '100%' }} />

          <p style={{ fontSize: 20, fontWeight: 700, lineHeight: '28px', color: 'var(--pitch)', margin: 0 }}>
            We found your best price on CAPLYTA!
          </p>

          {/* Patient-assistance banner — uninsured and government coverage only.
              Figma (10Tk5IOa5hql2baZEgZMeu, node 2373:9370) places it inside the
              order summary, between the supply line and the price box. */}
          {plan.papBanner && (
            <div style={{ width: '100%', boxSizing: 'border-box', background: 'var(--sky-tint)', border: '1px solid var(--sky-disabled)', borderRadius: 4, padding: 12 }}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: '20px', color: 'var(--pitch)' }}>
                You may be eligible for the manufacturer&rsquo;s patient assistance program. To learn more{' '}
                <a href={PAP_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--sky)' }}>click here</a>.
              </p>
            </div>
          )}

          <div style={{ width: '100%', boxSizing: 'border-box', border: '1px solid var(--fade)', borderRadius: 4, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, lineHeight: '26px', color: 'var(--pitch)' }}>
              {plan.priceLine}
              {plan.listPrice && (
                <>
                  {' '}
                  <span style={{ fontWeight: 400, textDecoration: 'line-through', color: '#9e9e9e' }}>{plan.listPrice}*</span>
                </>
              )}
              {plan.discountLabel && (
                <>
                  {' '}
                  <span style={{ background: '#fee000', color: 'var(--pitch)', fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 2, whiteSpace: 'nowrap' }}>{plan.discountLabel}</span>
                </>
              )}
            </p>
            {plan.note && (
              <p style={{ margin: 0, fontSize: 14, lineHeight: '20px', color: 'var(--gunmetal)' }}>{plan.note}</p>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--pitch)' }}>Your total cost</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--pitch)' }}>{plan.total}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
            <Button
              hierarchy="primary"
              fullWidth
              onClick={() => {
                setSummaryOpen(false);
                setOpenSection('shipping');
              }}
            >
              Next
            </Button>
            <Button hierarchy="tertiary" fullWidth>Manage your prescription</Button>
          </div>

          {/* Only meaningful next to a struck-through comparison price. */}
          {plan.listPrice && (
            <p style={{ fontSize: 14, color: 'var(--gunmetal)', opacity: 0.8, margin: 0 }}>
              *GoodRx reported price as of 10/15/2025
            </p>
          )}
          </React.Fragment>
          )}
        </div>

        {openSection === null && (
          <p style={{ fontSize: 16, color: 'var(--pitch)', margin: 0 }}>Please select next to move to the next step.</p>
        )}

        <PaymentAccordions openSection={openSection} onOpenSectionChange={setOpenSection} />
      </div>

      <MyPhilFooter insuranceNote />
    </div>
  );
}
