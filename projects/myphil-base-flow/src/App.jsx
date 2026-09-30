import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DeviceFrame } from '@ds/components/navigation/DeviceFrame/DeviceFrame.jsx';
import { PAGES } from './pageRegistry.js';
import { FlowNavigatorPage } from './flow/FlowNavigatorPage.jsx';

const SCREEN_MAX_WIDTH = 600;

function JourneyScreens() {
  return (
    <DeviceFrame hostname="philrx.com">
      <Routes>
        <Route path="/" element={<Navigate to="/sms" replace />} />
        {PAGES.map(([path, Page]) => (
          <Route
            key={path}
            path={path}
            element={
              <div style={{ width: '100%', maxWidth: SCREEN_MAX_WIDTH, margin: '0 auto', background: '#fff' }}>
                <Page />
              </div>
            }
          />
        ))}
      </Routes>
    </DeviceFrame>
  );
}

export function App() {
  // /flow hosts its own isolated MemoryRouter per previewed screen (see
  // FlowPreviewPane) — react-router refuses to nest a Router inside a
  // Router, so /flow must never enter the outer BrowserRouter at all.
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/flow')) {
    return <FlowNavigatorPage />;
  }

  return (
    <BrowserRouter>
      <JourneyScreens />
    </BrowserRouter>
  );
}
