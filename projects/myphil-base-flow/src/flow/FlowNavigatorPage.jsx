import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FLOW_STAGES, FLOW_SCREEN_BY_PATH } from './flowData.js';
import { DEVICE } from './deviceSizes.js';
import { FlowPreviewPane } from './FlowPreviewPane.jsx';
import { FlowInfoPanel } from './FlowInfoPanel.jsx';

const FIRST_PATH = FLOW_STAGES[0].screens[0].path;

// Every screen path (e.g. "/sms", "/second-chance-enrollment?combined=1")
// maps 1:1 onto "/flow" + that path, so the address bar always shows
// whichever screen is currently previewed, and a /flow/<path> URL can be
// opened directly to land on that screen.
function urlForScreenPath(screenPath) {
  return '/flow' + screenPath;
}

function screenPathFromLocation() {
  if (typeof window === 'undefined') return null;
  const { pathname, search } = window.location;
  if (!pathname.startsWith('/flow/')) return null;
  const candidate = pathname.slice('/flow'.length) + search;
  return FLOW_SCREEN_BY_PATH[candidate] ? candidate : null;
}

export function FlowNavigatorPage() {
  const [selectedPath, setSelectedPath] = useState(() => screenPathFromLocation() ?? FIRST_PATH);
  const didInitRef = useRef(false);

  // Keep the address bar in sync with whichever screen is selected: replace
  // on the very first sync (so landing here doesn't add a throwaway history
  // entry), push on every real change after that (so back/forward step
  // through screen history same as any other URL-driven navigation).
  useEffect(() => {
    const url = urlForScreenPath(selectedPath);
    const current = window.location.pathname + window.location.search;
    if (current !== url) {
      if (didInitRef.current) {
        window.history.pushState({ flowPath: selectedPath }, '', url);
      } else {
        window.history.replaceState({ flowPath: selectedPath }, '', url);
      }
    }
    didInitRef.current = true;
  }, [selectedPath]);

  // Back/forward support: react to the browser's own history navigation.
  useEffect(() => {
    const onPopState = () => {
      const path = screenPathFromLocation();
      if (path) setSelectedPath(path);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Fires when the preview's isolated router moves to a different screen
  // (a real "Continue" click inside the phone), keeping the info panel and
  // URL in sync with wherever the click-through actually landed.
  const handlePreviewNavigate = useCallback((pathname) => {
    // selectedPath may carry a ?combined=1 query (the "combined" scenario
    // entries); useLocation() never reports that back, so compare against
    // the bare pathname or a same-screen combined variant would always look
    // like real navigation and bounce straight back to its plain sibling.
    const selectedPathname = selectedPath.split('?')[0];
    if (FLOW_SCREEN_BY_PATH[pathname] && pathname !== selectedPathname) {
      setSelectedPath(pathname);
    }
  }, [selectedPath]);

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', background: '#f4f4f4', fontFamily: 'var(--font-body)' }}>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
        <FlowPreviewPane
          path={selectedPath}
          onLocationChange={handlePreviewNavigate}
          deviceWidth={DEVICE.width}
          deviceHeight={DEVICE.height}
        />
      </div>

      <FlowInfoPanel path={selectedPath} />
    </div>
  );
}
