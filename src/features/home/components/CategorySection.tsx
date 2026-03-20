'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { useInitialLoad } from '@/providers/InitialLoadProvider';
import { gsap, useGSAP } from '@/lib/gsap';
import useIsMobile from '@/hooks/useIsMobile';
import CardListAnimator from '@/components/animations/CardListAnimator';
import { Button } from '@/components/ui/button';
import type { Category } from '@/features/category/types/category';
import ExampleCard from '@/features/example/components/ExampleCard';
import type { ExampleCardData } from '@/features/example/types/example';

interface CategorySectionProps {
  category: Category;
  examples: ExampleCardData[];
  isFirstSection?: boolean;
}

const CategorySection = ({
  category,
  examples,
  isFirstSection = false,
}: CategorySectionProps) => {
  const categorySectionRef = useRef(null);
  const isMobile = useIsMobile();
  const { isInitialLoadComplete } = useInitialLoad();

  useGSAP(
    () => {
      if (!categorySectionRef.current || !isInitialLoadComplete) return;
      const startValue = isMobile ? 'top 90%' : 'top 80%';

      gsap.fromTo(
        categorySectionRef.current,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: categorySectionRef.current,
            start: startValue,
            once: true,
          },
        },
      );
    },
    {
      scope: categorySectionRef,
      dependencies: [isMobile, isInitialLoadComplete],
      revertOnUpdate: true,
    },
  );

  return (
    <div
      ref={categorySectionRef}
      className={isInitialLoadComplete ? '' : 'translate-y-24 opacity-0'}
      style={{ contentVisibility: 'auto', containIntrinsicSize: '720px' }}
    >
      <div className="mb-8 flex items-center justify-between">
        <div className="flex flex-col gap-3">
          <h2
            className={`text-3xl font-bold md:text-4xl ${category.textColor}`}
          >
            {category.title}
          </h2>
          <p className="text-xl text-gray-400">
            {category.description}
          </p>
        </div>
        <Button
          variant="link"
          asChild
          className={`hidden md:flex ${category.textColor}`}
        >
          <Link href={`/${category.type}`}>
            전체 보기
            <ChevronRight size={16} />
          </Link>
        </Button>
      </div>
      <CardListAnimator direction="left">
        <div className="px-3 md:px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {examples.map((item, index) => (
              <ExampleCard
                key={item.id}
                category={category}
                example={item}
                priority={isFirstSection && index < 4}
              />
            ))}
          </div>
        </div>
      </CardListAnimator>
      <div className={`mt-8 flex justify-center md:hidden`}>
        <Button
          variant="link"
          asChild
          className={`${category.textColor} border text-center ${category.borderColor} h-auto rounded-full px-6 py-3`}
        >
          <Link href={`/${category.type}`}>
            전체 보기
            <ChevronRight size={16} />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CategorySection;
