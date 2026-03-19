'use client';

// 위치 다시...
import { useRef } from 'react';

import { useInitialLoad } from '@/providers/InitialLoadProvider';
import { gsap, useGSAP } from '@/lib/gsap';

interface ContentAnimatorProps {
  children: React.ReactNode;
}

const ContentAnimator = ({ children }: ContentAnimatorProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { isInitialLoadComplete } = useInitialLoad();

  useGSAP(
    () => {
      if (!contentRef.current || !isInitialLoadComplete) return;

      gsap.from(contentRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });
    },
    {
      scope: contentRef,
      dependencies: [isInitialLoadComplete],
      revertOnUpdate: true,
    },
  );
  return (
    <div
      ref={contentRef}
      className={`relative mx-auto max-w-5xl ${
        isInitialLoadComplete ? '' : 'translate-y-12 opacity-0'
      }`}
    >
      {children}
    </div>
  );
};

export default ContentAnimator;
