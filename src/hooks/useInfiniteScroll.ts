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
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);

  const observerRef = useRef(null);
  const hasMountedRef = useRef(false);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(initialHasMore);
  const isLoadingRef = useRef(false);
  const fetchFnRef = useRef(fetchFn);

  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const mergeUniqueData = useCallback((prev: T[], next: T[]) => {
    const merged = [...prev, ...next];
    const seenIds = new Set<string>();

    return merged.filter(item => {
      if (
        typeof item !== 'object' ||
        item === null ||
        !('id' in item) ||
        typeof item.id !== 'string'
      ) {
        return true;
      }

      if (seenIds.has(item.id)) {
        return false;
      }

      seenIds.add(item.id);
      return true;
    });
  }, []);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const reset = async () => {
      isLoadingRef.current = true;
      setIsLoading(true);

      try {
        const { data: queryData, hasMore: queryHasMore } =
          await fetchFnRef.current(0);

        setData(queryData);
        pageRef.current = 1;
        hasMoreRef.current = queryHasMore;
        setHasMore(queryHasMore);
      } finally {
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    };

    void reset();
  }, [searchQuery]);

  const fetchMore = useCallback(async () => {
    if (!hasMoreRef.current || isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      // setTimeout 테스트용
      const [{ data: newData, hasMore: moreAvailable }] = await Promise.all([
        fetchFnRef.current(pageRef.current),
        new Promise(resolve => setTimeout(resolve, 700)),
      ]);

      setData(prev => mergeUniqueData(prev, newData));
      pageRef.current += 1;
      hasMoreRef.current = moreAvailable;
      setHasMore(moreAvailable);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [mergeUniqueData]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          void fetchMore();
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
  }, [fetchMore]);

  return {
    data,
    hasMore,
    isLoading,
    observerRef,
    setData,
  };
};

export default useInfiniteScroll;
