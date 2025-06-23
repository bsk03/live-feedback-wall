import React, { useEffect } from "react";

export const useInfiniteScroll = (
  fetchData: () => Promise<unknown>,
  hasMore: boolean,
) => {
  const loadMoreRef = React.useRef<HTMLDivElement | null>(null);

  const handleIntersection = React.useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const isIntersecting = entries[0]?.isIntersecting;
      if (isIntersecting && hasMore) {
        (async () => {
          await fetchData();
        })();
      }
    },
    [fetchData, hasMore],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "100px", // Trigger 100px before element is visible
    });

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [handleIntersection]);

  return { loadMoreRef };
};
