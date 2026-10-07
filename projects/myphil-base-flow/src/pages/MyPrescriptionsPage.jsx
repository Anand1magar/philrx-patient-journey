import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ds/components/forms/Button/Button.jsx';
import { Icon } from '@ds/assets/icons/Icon.jsx';
import { PhilRxAppHeader } from '../components/PhilRxAppHeader.jsx';
import { MyPhilFooter } from '@ds/components/navigation/MyPhilFooter/MyPhilFooter.jsx';
import { PRESCRIPTION_STATUSES } from './prescriptionStatuses.js';

const divider = <div style={{ borderTop: '1px solid var(--fade)', width: '100%' }} />;

// One screen, seven statuses. Every route that renders this page passes the
// status key it represents — see prescriptionStatuses.js for the copy and
// pageRegistry.js for the route -> status mapping.
export function MyPrescriptionsPage({ status = 'cost-ready' }) {
  const navigate = useNavigate();
  const [openQuestion, setOpenQuestion] = useState(null);
  const config = PRESCRIPTION_STATUSES[status];

  return (
    <div style={{ width: '100%', minHeight: '100vh', boxSizing: 'border-box', background: 'var(--paper)', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'var(--font-body)' }}>
      <PhilRxAppHeader active="rx" />

      <div style={{ width: '100%', flex: 1, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 16px 60px' }}>
        <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--pitch)', margin: 0 }}>My prescriptions</p>

        <div style={{ width: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid var(--fade)', borderRadius: 4, padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--pitch)', margin: 0 }}>Drugname (chemical compositions) (volume)</p>
            <p style={{ fontSize: 14, color: 'var(--pitch)', margin: 0 }}>XX-day supply | X refills remaining</p>
          </div>

          {divider}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 14, color: 'var(--pitch)', margin: 0 }}>Status as of XX/XX/XX:</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--foliage)', margin: 0 }}>{config.headline}</p>

            {config.paragraphs.map((text) => (
              <p key={text} style={{ fontSize: 14, lineHeight: '20px', color: 'var(--pitch)', margin: 0 }}>{text}</p>
            ))}

            {config.dividerBeforeNotes && config.notes.length > 0 && divider}

            {config.notes.map((text) => (
              <p key={text} style={{ fontSize: 14, lineHeight: '20px', fontStyle: 'italic', color: 'var(--pitch)', margin: 0 }}>{text}</p>
            ))}
          </div>

          {divider}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
            {config.actions.map((action) => (
              <Button
                key={action.label}
                hierarchy={action.hierarchy}
                fullWidth
                onClick={action.to ? () => navigate(action.to) : undefined}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        <div style={{ width: '100%', boxSizing: 'border-box', background: '#fff', border: '1px solid var(--fade)', borderRadius: 4, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--pitch)', margin: 0 }}>FAQ</p>
          <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {config.faq.map((question, index) => {
              const isOpen = openQuestion === index;
              return (
                <div
                  key={question}
                  style={{
                    borderTop: index === 0 ? '1px solid var(--fade)' : 'none',
                    borderBottom: '1px solid var(--fade)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenQuestion(isOpen ? null : index)}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: 8,
                      alignItems: 'flex-start',
                      padding: '12px 0',
                      fontFamily: 'var(--font-body)',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ flex: 1, fontSize: 16, fontWeight: 700, color: 'var(--pitch)' }}>{question}</span>
                    <Icon name={isOpen ? 'ArrowDropUpStyleFilled' : 'ArrowDropDownStyleFilled'} size={24} style={{ color: 'var(--pitch)', flexShrink: 0 }} />
                  </button>
                  {isOpen && (
                    <p style={{ margin: '0 0 16px', fontSize: 14, color: 'var(--gunmetal)' }}>
                      Answer coming soon.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
          {config.faqSeeMore && (
            <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 14, color: 'var(--text-link)', alignSelf: 'flex-start' }}>See more</a>
          )}
        </div>
      </div>

      <MyPhilFooter insuranceNote />
    </div>
  );
}
