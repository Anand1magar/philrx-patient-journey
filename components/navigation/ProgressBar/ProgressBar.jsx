import React from 'react';

// Step progress bar — shows percent complete through the current Enrollment branch.
// Ported from cashflow-phil's ProgressBar (src/components/ProgressBar.jsx), redone
// as inline styles to match this design system's component convention (see MyPhilHeader).
export function ProgressBar({ percent }) {
  const pct = Math.max(0, Math.min(100, percent));
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', boxSizing: 'border-box', padding: '12px 16px 0' }}
    >
      <div style={{ flex: 1, height: 8, borderRadius: 24, background: 'var(--sky-tint)', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 24, background: 'var(--sky)', width: pct + '%' }} />
      </div>
      <span style={{ width: 40, textAlign: 'right', fontWeight: 700, fontSize: 12, lineHeight: '20px', color: 'var(--sky)' }}>{pct}%</span>
    </div>
  );
}
