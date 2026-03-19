'use client';

import { useRef } from 'react';

import { useInitialLoad } from '@/providers/InitialLoadProvider';
import { gsap, useGSAP } from '@/lib/gsap';
import useIsMobile from '@/hooks/useIsMobile';

interface CardListAnimatorProps {
  direction: 'up' | 'down' | 'left' | 'right';
  children: React.ReactNode;
}

const FROM_MAP = {
  up: { y: 50, opacity: 0 },
  down: { y: -50, opacity: 0 },
  left: { x: 100, opacity: 0 },
  right: { x: -100, opacity: 0 },
};

const CardListAnimator = ({ direction, children }: CardListAnimatorProps) => {
  const isMobile = useIsMobile();
  const wrapperRef = useRef(null);
  const { isInitialLoadComplete } = useInitialLoad();

  useGSAP(
    () => {
      if (!wrapperRef.current || !isInitialLoadComplete) return;

      const cards = gsap.utils.toArray('.example-card', wrapperRef.current);
      const from = FROM_MAP[direction];
      const startValue = isMobile ? 'top 90%' : 'top 80%';

      gsap.fromTo(cards, from, {
        x: 0,
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: startValue,
        },
      });
    },
    {
      dependencies: [isMobile, isInitialLoadComplete],
      revertOnUpdate: true,
    },
  );
  return (
    <div
      ref={wrapperRef}
      className={isInitialLoadComplete ? '' : 'translate-y-12 opacity-0'}
    >
      {children}
    </div>
  );
};

export default CardListAnimator;
