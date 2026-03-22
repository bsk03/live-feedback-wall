import { useCallback, useEffect, useRef } from "react";

type UseInfiniteScrollOptions = {
  onBeforeFetch?: () => void;
};

export const useInfiniteScroll = <T = unknown>(
  fetchData?: () => Promise<T>,
  hasMore?: boolean,
  options?: UseInfiniteScrollOptions,
) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const isIntersecting = entries[0]?.isIntersecting;
      if (isIntersecting && hasMore && fetchData) {
        console.log("🔄 IntersectionObserver triggered, loading more...");
        (async () => {
          options?.onBeforeFetch?.();
          await fetchData();
        })();
      }
    },
    [fetchData, hasMore, options],
  );

  useEffect(() => {
    if (!fetchData) return; // Don't create observer if fetchData is not provided

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "100px",
      threshold: 0.1,
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [handleIntersection, fetchData]);

  return { loadMoreRef };
};
