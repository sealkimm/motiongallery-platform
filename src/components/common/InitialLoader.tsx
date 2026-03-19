'use client';

import { useEffect, useState } from 'react';

const MIN_VISIBLE_MS = 900;
const EXIT_DURATION_MS = 520;

const waitForNextPaint = () =>
  new Promise<void>(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });

const InitialLoader = () => {
  const [isLeaving, setIsLeaving] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    const startedAt = performance.now();
    document.body.dataset.initialLoading = 'true';

    let cancelled = false;
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;
    let unmountTimer: ReturnType<typeof setTimeout> | null = null;

    const finishLoading = async () => {
      await waitForNextPaint();

      const remaining = Math.max(0, MIN_VISIBLE_MS - (performance.now() - startedAt));

      leaveTimer = setTimeout(() => {
        if (cancelled) return;

        setIsLeaving(true);
        document.body.dataset.initialLoading = 'false';

        unmountTimer = setTimeout(() => {
          if (!cancelled) setIsMounted(false);
        }, EXIT_DURATION_MS);
      }, remaining);
    };

    if (document.readyState === 'complete') {
      void finishLoading();
    } else {
      window.addEventListener('load', finishLoading, { once: true });
    }

    return () => {
      cancelled = true;
      document.body.dataset.initialLoading = 'false';
      window.removeEventListener('load', finishLoading);

      if (leaveTimer) clearTimeout(leaveTimer);
      if (unmountTimer) clearTimeout(unmountTimer);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      aria-hidden="true"
      className={`initial-loader ${isLeaving ? 'initial-loader--hidden' : ''}`}
    >
      <div className="initial-loader__backdrop" />
      <div className="initial-loader__glow initial-loader__glow--left" />
      <div className="initial-loader__glow initial-loader__glow--right" />

      <div className="initial-loader__content">
        <div className="initial-loader__title-wrap">
          <span className="initial-loader__title">Motion Gallery</span>
          <span className="initial-loader__title-shadow">Motion Gallery</span>
        </div>

        <div className="initial-loader__bar">
          <span className="initial-loader__bar-fill" />
        </div>
      </div>
    </div>
  );
};

export default InitialLoader;
