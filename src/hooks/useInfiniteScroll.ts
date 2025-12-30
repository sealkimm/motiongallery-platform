'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollProps<T> {
  initialData: T[];
  initialHasMore: boolean;
  searchQuery?: string;
  fetchFn: (page: number) => Promise<{
    data: T[];
    hasMore: boolean;
  }>;
}

const useInfiniteScroll = <T>({
  initialData,
  initialHasMore,
  searchQuery,
  fetchFn,
}: UseInfiniteScrollProps<T>) => {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);

  const observerRef = useRef(null);

  useEffect(() => {
    const reset = async () => {
      setIsLoading(true);

      const { data: queryData, hasMore: queryHasMore } = await fetchFn(0);

      setData(queryData);
      setHasMore(queryHasMore);
      setPage(1);
      setIsLoading(false);
    };

    reset();
  }, [searchQuery]);

  const fetchMore = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);

    // setTimeout 테스트용
    const [{ data: newData, hasMore: moreAvailable }] = await Promise.all([
      fetchFn(page),
      new Promise(resolve => setTimeout(resolve, 700)),
    ]);

    setData(prev => [...prev, ...newData]);
    setHasMore(moreAvailable);
    setPage(prev => prev + 1);
    setIsLoading(false);
  }, [fetchFn, hasMore, isLoading, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' },
    );

    const currentTarget = observerRef.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchMore, hasMore, isLoading]);

  return {
    data,
    hasMore,
    isLoading,
    observerRef,
    setData,
  };
};

export default useInfiniteScroll;
