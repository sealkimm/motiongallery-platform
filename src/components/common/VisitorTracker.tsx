'use client';

import { useEffect } from 'react';

const VisitorTracker = () => {
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const cookies = document.cookie.split(';');

    const lastVisit = cookies
      .find(row => row.startsWith('last_visit='))
      ?.split('=')[1];

    if (lastVisit !== today) {
      fetch('/api/visitor', { method: 'POST' });
    }

    const expires = new Date();
    expires.setHours(23, 59, 59, 999);

    document.cookie = `last_visit=${today}; expires=${expires.toUTCString()}; path=/`;
  }, []);

  return null;
};

export default VisitorTracker;
