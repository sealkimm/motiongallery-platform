'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { gsap, useGSAP } from '@/lib/gsap';
import useIsMobile from '@/hooks/useIsMobile';
import CardListAnimator from '@/components/animations/CardListAnimator';
import { Button } from '@/components/ui/button';
import type { Category } from '@/features/category/types/category';
import ExampleCard from '@/features/example/components/ExampleCard';
import type { ExampleDetails } from '@/features/example/types/example';

interface CategorySectionProps {
  category: Category;
  examples: ExampleDetails[];
}

const CategorySection = ({ category, examples }: CategorySectionProps) => {
  const categorySectionRef = useRef(null);
  const isMobile = useIsMobile();

  useGSAP(
    () => {
      if (!categorySectionRef.current) return;
      const startValue = isMobile ? 'top 90%' : 'top 80%';

      gsap.from(categorySectionRef.current, {
        scrollTrigger: {
          trigger: categorySectionRef.current,
          start: startValue,
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });
    },
    {
      scope: categorySectionRef,
      dependencies: [isMobile],
      revertOnUpdate: true,
    },
  );

  return (
    <div ref={categorySectionRef}>
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {examples.map(item => (
            <ExampleCard key={item.id} category={category} example={item} />
          ))}
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
