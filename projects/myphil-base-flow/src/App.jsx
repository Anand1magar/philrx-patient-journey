import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DeviceFrame } from '@ds/components/navigation/DeviceFrame/DeviceFrame.jsx';
import { PAGES } from './pageRegistry.js';
import { FlowNavigatorPage } from './flow/FlowNavigatorPage.jsx';

const SCREEN_MAX_WIDTH = 600;

function JourneyScreens() {
  return (
    <DeviceFrame hostname="philrx.com">
      <Routes>
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
  // The root path also opens the flow navigator: it's the canonical entry
  // point for reviewing the patient journey, not any single screen.
  if (typeof window !== 'undefined') {
    const { pathname } = window.location;
    if (pathname === '/') {
      window.history.replaceState(null, '', '/flow');
      return <FlowNavigatorPage />;
    }
    if (pathname.startsWith('/flow')) {
      return <FlowNavigatorPage />;
    }
  }

  return (
    <BrowserRouter>
      <JourneyScreens />
    </BrowserRouter>
  );
}
