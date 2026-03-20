'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { ScrollTrigger } from '@/lib/gsap';

const useScrollTriggerRefresh = () => {
  const pathname = usePathname();

  useEffect(() => {
    const refreshScrollTrigger = () => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    refreshScrollTrigger();

    window.addEventListener('pageshow', refreshScrollTrigger);

    return () => {
      window.removeEventListener('pageshow', refreshScrollTrigger);
    };
  }, [pathname]);
};

export default useScrollTriggerRefresh;
