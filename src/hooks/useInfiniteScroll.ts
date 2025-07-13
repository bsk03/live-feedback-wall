import { useCallback, useEffect, useRef } from "react";

type UseInfiniteScrollOptions = {
  onBeforeFetch?: () => void;
};

export const useInfiniteScroll = (
  fetchData: () => Promise<unknown>,
  hasMore: boolean,
  options?: UseInfiniteScrollOptions,
) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const isIntersecting = entries[0]?.isIntersecting;
      if (isIntersecting && hasMore) {
        (async () => {
          options?.onBeforeFetch?.();
          await fetchData();
        })();
      }
    },
    [fetchData, hasMore, options],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "100px",
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [handleIntersection]);

  return { loadMoreRef };
};
