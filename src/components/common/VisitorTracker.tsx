'use client';

import { useEffect } from 'react';

const VisitorTracker = () => {
  useEffect(() => {
    const trackVisitor = () => {
      const today = new Date().toISOString().slice(0, 10);
      const cookies = document.cookie.split(';');

      const lastVisit = cookies
        .find(row => row.startsWith('last_visit='))
        ?.split('=')[1];

      if (lastVisit !== today) {
        fetch('/api/visitor', { method: 'POST', keepalive: true });
      }

      const expires = new Date();
      expires.setHours(23, 59, 59, 999);

      document.cookie = `last_visit=${today}; expires=${expires.toUTCString()}; path=/`;
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
