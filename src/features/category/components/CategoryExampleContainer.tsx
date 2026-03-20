'use client';

import { useState } from 'react';

import useDebounce from '@/hooks/useDebounce';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import EmptyState from '@/components/common/EmptyState';
import CategorySearchBar from '@/features/category/components/CategorySearchBar';
import { getExamplesByCategory } from '@/features/example/api/getCategoryExamples';
import ExampleSection from '@/features/example/components/ExampleSection';
import type { ExampleCardData } from '@/features/example/types/example';

import type { Category } from '../types/category';

interface CategoryExampleContainerProps {
  category: Category;
  examples: ExampleCardData[];
  hasMore: boolean;
}

// 상수 분리
const PAGE_SIZE = 12;

const CategoryExampleContainer = ({
  category,
  examples: initialData,
  hasMore: initialHasMore,
}: CategoryExampleContainerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery);

  const {
    data: examples,
    isLoading,
    observerRef,
  } = useInfiniteScroll({
    initialData,
    initialHasMore,
    searchQuery: debouncedSearchQuery,
    fetchFn: page =>
      getExamplesByCategory({
        type: category.type,
        searchQuery: debouncedSearchQuery,
        page,
        pageSize: PAGE_SIZE,
      }),
  });

  const isEmptyData = !isLoading && examples.length === 0;

  const emptyStateProps = searchQuery
    ? {
        title: '검색 결과가 없습니다.',
        description: `"${searchQuery}" 에 해당하는 예제를 찾을 수 없습니다.`,
      }
    : {
        title: '등록된 예제가 없습니다.',
        description: `아직 등록된 [${category.title}] 카테고리의 애니메이션이 없습니다. 새로운 모션 예제를 추가해보세요!`,
      };

  return (
    <>
      <CategorySearchBar category={category} onSearch={setSearchQuery} />
      {isEmptyData ? (
        <EmptyState {...emptyStateProps} />
      ) : (
        <ExampleSection
          category={category}
          examples={examples}
          isLoading={isLoading}
          observerRef={observerRef}
        />
      )}
    </>
  );
};

export default CategoryExampleContainer;
