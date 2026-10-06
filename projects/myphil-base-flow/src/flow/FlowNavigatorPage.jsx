import React, { useCallback, useState } from 'react';
import { FLOW_STAGES, FLOW_SCREEN_BY_PATH } from './flowData.js';
import { DEVICE } from './deviceSizes.js';
import { FlowPreviewPane } from './FlowPreviewPane.jsx';
import { FlowInfoPanel } from './FlowInfoPanel.jsx';

const FIRST_PATH = FLOW_STAGES[0].screens[0].path;

export function FlowNavigatorPage() {
  const [selectedPath, setSelectedPath] = useState(FIRST_PATH);

  // Fires when the preview's isolated router moves to a different screen
  // (a real "Continue" click inside the phone), keeping the info panel in
  // sync with wherever the click-through actually landed.
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
