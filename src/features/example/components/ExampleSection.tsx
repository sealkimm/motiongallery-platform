'use client';

import CardListAnimator from '@/components/animations/CardListAnimator';
import type { Category } from '@/features/category/types/category';

import type { ExampleCardData } from '../types/example';
import ExampleCard from './ExampleCard';
import ExampleSkeleton from './ExampleSkeleton';

interface ExampleSectionProps {
  category: Category;
  examples: ExampleCardData[];
  isLoading: boolean;
  observerRef: React.RefObject<HTMLDivElement | null>;
}

const PAGE_SIZE = 12;

const ExampleSection = ({
  category,
  examples,
  isLoading,
  observerRef,
}: ExampleSectionProps) => {
  return (
    <>
      <CardListAnimator direction="up">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {examples.map(item => (
            <ExampleCard key={item.id} category={category} example={item} />
          ))}
        </div>
      </CardListAnimator>
      {isLoading && <ExampleSkeleton count={PAGE_SIZE} />}
      <div ref={observerRef} className="h-10" />
    </>
  );
};
export default ExampleSection;
