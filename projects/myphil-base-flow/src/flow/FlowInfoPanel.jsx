import React from 'react';
import { FLOW_SCREEN_BY_PATH } from './flowData.js';

export function FlowInfoPanel({ path }) {
  const screen = FLOW_SCREEN_BY_PATH[path];

  if (!screen) {
    return <div style={{ width: 360, flexShrink: 0, borderLeft: '1px solid var(--fade)' }} />;
  }

  return (
    <div style={{ width: 360, flexShrink: 0, height: '100%', boxSizing: 'border-box', borderLeft: '1px solid var(--fade)', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <div style={{ padding: '20px 20px 14px', borderBottom: '1px solid var(--fade)' }}>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--pitch)' }}>Overview</p>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--gunmetal)' }}>Stage</p>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--pitch)' }}>{screen.stage}</p>
        </div>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--gunmetal)' }}>Trigger</p>
          <p style={{ margin: 0, fontSize: 14, lineHeight: '21px', color: 'var(--pitch)' }}>{screen.trigger}</p>
        </div>
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--gunmetal)' }}>System action</p>
          <p style={{ margin: 0, fontSize: 14, lineHeight: '21px', color: 'var(--pitch)' }}>{screen.action}</p>
        </div>
      </div>
    </div>
  );
}
