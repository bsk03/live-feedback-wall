import { useEffect, useRef, useState } from "react";

export const useChatScroll = <T>(
  messages: T[],
  options?: {
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoading?: boolean;
  },
) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad && messages.length > 0 && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      setIsInitialLoad(false);
    }
  }, [messages, isInitialLoad]);

  useEffect(() => {
    if (shouldAutoScroll && containerRef.current && !isInitialLoad) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, shouldAutoScroll, isInitialLoad]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setShouldAutoScroll(isNearBottom);
    }
  };

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const isIntersecting = entries[0]?.isIntersecting;
        if (isIntersecting && options?.hasMore && options?.onLoadMore) {
          options.onLoadMore();
        }
      },
      {
        rootMargin: "100px",
      },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [options?.hasMore, options?.onLoadMore]);

  return {
    containerRef,
    loadMoreRef,
    shouldAutoScroll,
    setShouldAutoScroll,
    handleScroll,
  };
};
