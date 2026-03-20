'use client';

import { useEffect } from 'react';

const VisitorTracker = () => {
  useEffect(() => {
    const trackVisitor = () => {
      void fetch('/api/visitor', { method: 'POST', keepalive: true });
    };

    const requestIdleCallback = window.requestIdleCallback?.bind(window);
    const cancelIdleCallback = window.cancelIdleCallback?.bind(window);

    if (requestIdleCallback && cancelIdleCallback) {
      const idleId = requestIdleCallback(trackVisitor, { timeout: 2000 });

      return () => cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(trackVisitor, 300);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return null;
};

export default VisitorTracker;
