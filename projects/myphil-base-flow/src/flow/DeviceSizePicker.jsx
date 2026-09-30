import React from 'react';
import { DEVICE_SIZES } from './deviceSizes.js';

export function DeviceSizePicker({ selectedId, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 999, background: '#fff', boxShadow: '0 2px 10px rgba(16,18,22,0.08), 0 0 0 1px rgba(16,18,22,0.06)' }}>
      {DEVICE_SIZES.map((device) => {
        const active = device.id === selectedId;
        return (
          <button
            key={device.id}
            type="button"
            onClick={() => onSelect(device.id)}
            style={{
              border: 'none',
              cursor: 'pointer',
              padding: '7px 14px',
              borderRadius: 999,
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: 13,
              lineHeight: 1,
              color: active ? '#fff' : 'var(--pitch)',
              background: active ? 'var(--sky)' : 'transparent',
              whiteSpace: 'nowrap',
            }}
          >
            {device.label}
          </button>
        );
      })}
    </div>
  );
}
