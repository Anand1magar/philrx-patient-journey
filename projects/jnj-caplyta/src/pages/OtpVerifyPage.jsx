import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ds/components/forms/Button/Button.jsx';
import { BrandAppHeader } from '../components/BrandAppHeader.jsx';
import { JnjFooter as MyPhilFooter } from '../components/JnjFooter.jsx';
import { useAuthNext } from '../authNext.js';

const CODE_LENGTH = 6;
const BORDER_COLOR = { default: 'var(--pitch)', focused: 'var(--sky)', filled: 'var(--pitch)' };

export function OtpVerifyPage() {
  const navigate = useNavigate();
  // Last screen in the log-in chain, so this is the one that consumes ?next=
  // and decides where the chain lands — see authNext.js.
  const { destination } = useAuthNext();
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(null);
  const inputRefs = useRef([]);

  const handleChange = (index, rawValue) => {
    const value = rawValue.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = () => {
    navigate(destination);
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', boxSizing: 'border-box', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'var(--font-body)' }}>
      <BrandAppHeader />

      <div style={{ width: '100%', flex: 1, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, lineHeight: '36px', color: 'var(--pitch)', margin: 0 }}>Enter Verification Code</h1>
          <p style={{ fontSize: 16, lineHeight: '24px', color: 'var(--pitch)', margin: 0 }}>
            We&rsquo;ve sent a one-time code by text message to (***)***-1301. Enter the code below to verify.
          </p>
          <p style={{ fontSize: 16, lineHeight: '24px', color: 'var(--pitch)', margin: 0 }}>
            If you don&rsquo;t see it, check that your phone can receive messages from short codes. The code expires in 15 minutes.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {digits.map((digit, index) => {
              const boxState = digit ? 'filled' : 'default';
              const effState = focusedIndex === index ? 'focused' : boxState;
              return (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex((current) => (current === index ? null : current))}
                  style={{
                    width: 42,
                    height: 48,
                    border: 'none',
                    borderRadius: 4,
                    boxShadow: `0 0 0 ${focusedIndex === index ? 2 : 1}px ${BORDER_COLOR[effState]}`,
                    background: boxState === 'filled' ? 'var(--paper)' : 'transparent',
                    textAlign: 'center',
                    fontFamily: 'var(--font-body)',
                    fontSize: 16,
                    color: 'var(--pitch)',
                    boxSizing: 'border-box',
                  }}
                />
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Button hierarchy="primary" fullWidth onClick={handleConfirm}>Confirm</Button>
          <Button hierarchy="secondary" fullWidth>Resend Code</Button>
        </div>
      </div>

      <MyPhilFooter />
    </div>
  );
}
