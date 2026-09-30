import React, { useCallback, useEffect, useState } from 'react';
import { FLOW_STAGES, FLOW_SCREEN_BY_PATH } from './flowData.js';
import { DEVICE_SIZES, DEFAULT_DEVICE_ID } from './deviceSizes.js';
import { FlowSidebar } from './FlowSidebar.jsx';
import { FlowPreviewPane } from './FlowPreviewPane.jsx';
import { FlowInfoPanel } from './FlowInfoPanel.jsx';
import { DeviceSizePicker } from './DeviceSizePicker.jsx';

const SEEN_KEY = 'flow-navigator:seen';
const DEVICE_KEY = 'flow-navigator:device';
const FIRST_PATH = FLOW_STAGES[0].screens[0].path;

function readSeen() {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function writeSeen(set) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...set]));
  } catch {
    // private mode — progress just won't persist
  }
}

function readDeviceId() {
  try {
    const v = localStorage.getItem(DEVICE_KEY);
    return DEVICE_SIZES.some((d) => d.id === v) ? v : DEFAULT_DEVICE_ID;
  } catch {
    return DEFAULT_DEVICE_ID;
  }
}

function writeDeviceId(id) {
  try {
    localStorage.setItem(DEVICE_KEY, id);
  } catch {
    // private mode — choice just won't persist
  }
}

export function FlowNavigatorPage() {
  const [selectedPath, setSelectedPath] = useState(FIRST_PATH);
  const [seenPaths, setSeenPaths] = useState(readSeen);
  const [deviceId, setDeviceId] = useState(readDeviceId);

  const device = DEVICE_SIZES.find((d) => d.id === deviceId) ?? DEVICE_SIZES.find((d) => d.id === DEFAULT_DEVICE_ID);

  const selectDevice = useCallback((id) => {
    setDeviceId(id);
    writeDeviceId(id);
  }, []);

  const markSeen = useCallback((path) => {
    if (!FLOW_SCREEN_BY_PATH[path]) return;
    setSeenPaths((prev) => {
      if (prev.has(path)) return prev;
      const next = new Set(prev);
      next.add(path);
      writeSeen(next);
      return next;
    });
  }, []);

  const select = useCallback((path) => {
    setSelectedPath(path);
    markSeen(path);
  }, [markSeen]);

  const reset = useCallback(() => {
    setSeenPaths(new Set());
    writeSeen(new Set());
    setSelectedPath(FIRST_PATH);
    markSeen(FIRST_PATH);
  }, [markSeen]);

  // Fires when the preview's isolated router moves to a different screen
  // (a real "Continue" click inside the phone), keeping the sidebar/info
  // panel in sync with wherever the click-through actually landed.
  const handlePreviewNavigate = useCallback((pathname) => {
    // selectedPath may carry a ?combined=1 query (the "combined" scenario
    // entries); useLocation() never reports that back, so compare against
    // the bare pathname or a same-screen combined variant would always look
    // like real navigation and bounce straight back to its plain sibling.
    const selectedPathname = selectedPath.split('?')[0];
    if (FLOW_SCREEN_BY_PATH[pathname] && pathname !== selectedPathname) {
      select(pathname);
    } else if (FLOW_SCREEN_BY_PATH[pathname]) {
      markSeen(pathname);
    }
  }, [selectedPath, select, markSeen]);

  useEffect(() => {
    markSeen(FIRST_PATH);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', background: '#f4f4f4', fontFamily: 'var(--font-body)' }}>
      <FlowSidebar selectedPath={selectedPath} onSelect={select} seenPaths={seenPaths} onReset={reset} />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'auto' }}>
        <div style={{ flexShrink: 0, padding: '20px 0 12px' }}>
          <DeviceSizePicker selectedId={device.id} onSelect={selectDevice} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 32px 32px' }}>
          <FlowPreviewPane
            path={selectedPath}
            onLocationChange={handlePreviewNavigate}
            deviceWidth={device.width}
            deviceHeight={device.height}
          />
        </div>
      </div>

      <FlowInfoPanel path={selectedPath} />
    </div>
  );
}
