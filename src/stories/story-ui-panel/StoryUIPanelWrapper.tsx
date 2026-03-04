import React, { useEffect, useState, useRef } from 'react';
import { StoryUIPanel } from './StoryUIPanel';

declare global {
  interface Window {
    STORY_UI_MCP_PORT?: string;
  }
}

export const StoryUIPanelWrapper = () => {
  const [isReady, setIsReady] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const mcpPortParam = urlParams.get('mcp-port');

      if (mcpPortParam) {
        window.STORY_UI_MCP_PORT = mcpPortParam;
      }
    }

    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          color: '#666',
        }}
      >
        Loading Story UI...
      </div>
    );
  }

  return <StoryUIPanel />;
};
