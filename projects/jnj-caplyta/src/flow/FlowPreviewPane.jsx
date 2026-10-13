import React, { useEffect } from 'react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { PhoneBezel } from './PhoneBezel.jsx';
import { PAGE_BY_PATH } from '../pageRegistry.js';
import { FLOW_SCREEN_BY_PATH } from './flowData.js';

// Reports the isolated router's current path up to the parent whenever it
// changes — this is how clicking real "Continue" buttons inside the preview
// (which call the page's own useNavigate()) can move the sidebar highlight
// and mark screens seen, without ever touching the outer app's URL.
function LocationReporter({ onLocationChange }) {
  const location = useLocation();
  useEffect(() => {
    onLocationChange(location.pathname);
  }, [location.pathname, onLocationChange]);
  return null;
}

// cashflow-phil is a separate app (own repo, own dev server, own hash router
// and plain-CSS design system) — embedded live via iframe against its own
// origin rather than imported as React components. Cross-origin, so we can't
// read its internal navigation the way LocationReporter does for our own
// pages; the sidebar is the only way to move between its screens here.
function ExternalPreview({ origin, hash }) {
  return (
    <iframe
      key={hash}
      src={`${origin}/?embed=1#/${hash}`}
      title="cashflow-phil preview"
      style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
    />
  );
}

// Pages call navigate('/next-path') against whatever router contains them.
// Rendering them inside the app's normal BrowserRouter would navigate the
// whole browser away from /flow and lose the sidebar/info panel. Wrapping
// each preview in its own MemoryRouter, keyed by path, isolates that
// navigation to just this pane.
export function FlowPreviewPane({ path, onLocationChange, deviceWidth, deviceHeight }) {
  const screen = FLOW_SCREEN_BY_PATH[path];
  if (!screen) return null;

  if (screen.external) {
    return (
      <PhoneBezel width={deviceWidth} height={deviceHeight} hideStatusBar={screen.hideStatusBar}>
        <ExternalPreview origin={screen.external.origin} hash={screen.hash} />
      </PhoneBezel>
    );
  }

  // Two sidebar entries (the "combined" scenarios) are the same route as
  // their plain sibling plus a ?combined=1 query string — PAGE_BY_PATH is
  // keyed on the bare pathname, so strip the query to look the component up.
  const pathname = path.split('?')[0];
  const Page = PAGE_BY_PATH[pathname];
  if (!Page) return null;

  const routedPreview = (
    <MemoryRouter initialEntries={[path]} key={path}>
      <LocationReporter onLocationChange={onLocationChange} />
      <Routes>
        {Object.entries(PAGE_BY_PATH).map(([p, PageComponent]) => (
          <Route key={p} path={p} element={<PageComponent />} />
        ))}
      </Routes>
    </MemoryRouter>
  );

  // A handful of screens (the payment-approval scenario picker) aren't
  // real patient screens — they're review-tool pickers, so they render as a
  // plain full-width page instead of inside the phone bezel. Same 100vh/
  // position:fixed neutralizing PhoneBezel applies, scoped to this wrapper
  // instead, otherwise the page would size itself to the whole browser
  // window rather than this pane.
  if (screen.isLandingPage) {
    return (
      <div
        className="flow-landing-screen"
        style={{ width: '100%', height: '100%', maxWidth: 960, boxSizing: 'border-box', overflowY: 'auto', background: '#fff', borderRadius: 12, boxShadow: '0 24px 48px -16px rgba(16,18,22,0.25)' }}
      >
        <style>{'.flow-landing-screen [style*="100vh"]{min-height:100% !important}.flow-landing-screen [style*="position: fixed"]{position:absolute !important}'}</style>
        {routedPreview}
      </div>
    );
  }

  return (
    <PhoneBezel width={deviceWidth} height={deviceHeight} hideStatusBar={screen.hideStatusBar}>
      {routedPreview}
    </PhoneBezel>
  );
}
