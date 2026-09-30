import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FLOW_STAGES } from './flowData.js';

const WIDTH_KEY = 'flow-navigator:sidebar-width';
const MIN_WIDTH = 220;
const MAX_WIDTH = 560;
const DEFAULT_WIDTH = 320;

function readWidth() {
  try {
    const v = Number(localStorage.getItem(WIDTH_KEY));
    return Number.isFinite(v) && v >= MIN_WIDTH && v <= MAX_WIDTH ? v : DEFAULT_WIDTH;
  } catch {
    return DEFAULT_WIDTH;
  }
}

function writeWidth(w) {
  try {
    localStorage.setItem(WIDTH_KEY, String(w));
  } catch {
    // private mode — width just won't persist
  }
}

const rowBase = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  width: '100%',
  boxSizing: 'border-box',
  padding: '8px 10px',
  borderRadius: 6,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'var(--font-body)',
  fontSize: 14,
};

function SeenMark({ seen }) {
  if (!seen) return <span style={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px solid var(--fade)', flexShrink: 0 }} />;
  return (
    <span style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--sky)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11 }}>✓</span>
  );
}

export function FlowSidebar({ selectedPath, onSelect, seenPaths, onReset }) {
  const [query, setQuery] = useState('');
  const [width, setWidth] = useState(readWidth);
  const dragState = useRef(null);

  const onHandlePointerDown = useCallback((e) => {
    dragState.current = { startX: e.clientX, startWidth: width };
    e.target.setPointerCapture(e.pointerId);
  }, [width]);

  const onHandlePointerMove = useCallback((e) => {
    if (!dragState.current) return;
    const delta = e.clientX - dragState.current.startX;
    const next = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, dragState.current.startWidth + delta));
    setWidth(next);
  }, []);

  const onHandlePointerUp = useCallback((e) => {
    if (!dragState.current) return;
    dragState.current = null;
    writeWidth(width);
    e.target.releasePointerCapture(e.pointerId);
  }, [width]);

  const totalScreens = useMemo(() => FLOW_STAGES.reduce((n, s) => n + s.screens.length, 0), []);
  const seenCount = seenPaths.size;
  const pct = totalScreens === 0 ? 0 : Math.round((seenCount / totalScreens) * 100);

  const q = query.trim().toLowerCase();
  const filteredStages = useMemo(() => {
    if (!q) return FLOW_STAGES;
    return FLOW_STAGES
      .map((stage) => ({
        ...stage,
        screens: stage.screens.filter((s) => s.title.toLowerCase().includes(q) || s.path.toLowerCase().includes(q)),
      }))
      .filter((stage) => stage.screens.length > 0);
  }, [q]);

  return (
    <div style={{ position: 'relative', width, flexShrink: 0, height: '100%', boxSizing: 'border-box', borderRight: '1px solid var(--fade)', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <style>{'.flow-sidebar-resize-handle:hover .flow-sidebar-resize-line, .flow-sidebar-resize-handle:active .flow-sidebar-resize-line { background: var(--sky); }'}</style>
      <div
        className="flow-sidebar-resize-handle"
        onPointerDown={onHandlePointerDown}
        onPointerMove={onHandlePointerMove}
        onPointerUp={onHandlePointerUp}
        style={{ position: 'absolute', top: 0, right: -4, width: 8, height: '100%', cursor: 'col-resize', zIndex: 10, touchAction: 'none' }}
      >
        <div className="flow-sidebar-resize-line" style={{ position: 'absolute', top: 0, left: 3, width: 2, height: '100%', background: 'transparent', transition: 'background .1s' }} />
      </div>

      <div style={{ padding: '20px 20px 14px', display: 'flex', flexDirection: 'column', gap: 12, borderBottom: '1px solid var(--fade)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--pitch)', fontFamily: 'var(--font-body)' }}>Screens</h1>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--gunmetal)' }}>{seenCount} / {totalScreens} seen</span>
            <button
              type="button"
              onClick={onReset}
              style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'var(--sky)', fontFamily: 'var(--font-body)' }}
            >
              Reset
            </button>
          </div>
        </div>
        <div style={{ height: 6, borderRadius: 24, background: 'var(--sky-tint)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 24, background: 'var(--sky)', width: pct + '%' }} />
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search screens..."
          style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: 6, border: '1px solid var(--fade)', fontFamily: 'var(--font-body)', fontSize: 14 }}
        />
      </div>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 10px' }}>
        {filteredStages.map((stage) => {
          const stageSeen = stage.screens.filter((s) => seenPaths.has(s.path)).length;
          return (
            <div key={stage.id} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 10px 8px', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--gunmetal)' }}>
                <span>{stage.label}</span>
                <span>{stageSeen}/{stage.screens.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {stage.screens.map((screen, idx) => {
                  const active = screen.path === selectedPath;
                  return (
                    <button
                      key={screen.path}
                      type="button"
                      onClick={() => onSelect(screen.path)}
                      style={{
                        ...rowBase,
                        background: active ? 'var(--sky-tint)' : 'none',
                        color: active ? 'var(--sky)' : 'var(--pitch)',
                        fontWeight: active ? 700 : 400,
                      }}
                    >
                      <SeenMark seen={seenPaths.has(screen.path)} />
                      <span style={{ width: 20, flexShrink: 0, fontVariantNumeric: 'tabular-nums', opacity: 0.6 }}>{String(idx + 1).padStart(2, '0')}</span>
                      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{screen.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
