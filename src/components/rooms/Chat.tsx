import type { Message as MessageType } from "@/app/rooms/[roomId]/page";
import { type RefObject, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { Message } from "./Message";
import { Loader2 } from "lucide-react";

export const Chat = ({
  messages,
  socket,
  loadMoreRef,
  lastMessageId,
  isLoading,
  onLoadMore,
}: {
  messages: MessageType[];
  socket: Socket | null;
  loadMoreRef: RefObject<HTMLDivElement>;
  lastMessageId: number | null;
  isLoading?: boolean;
  onLoadMore?: () => void;
}) => {
  const messageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToLatest, setShouldScrollToLatest] = useState(true);
  const prevMessagesLength = useRef(messages.length);

  // Setup intersection observer for loadMoreRef
  useEffect(() => {
    if (!chatContainerRef.current || !loadMoreRef.current || !onLoadMore)
      return;

    console.log("🔍 Setting up IntersectionObserver");

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        console.log(
          "🔍 Intersection:",
          entry?.isIntersecting,
          entry?.boundingClientRect,
        );
        if (entry?.isIntersecting) {
          console.log("🔄 loadMoreRef visible, triggering onLoadMore");
          onLoadMore();
        }
      },
      {
        root: chatContainerRef.current,
        rootMargin: "0px",
        threshold: 1.0,
      },
    );

    observer.observe(loadMoreRef.current);
    console.log("🔍 Observer attached");

    return () => {
      observer.disconnect();
    };
  }, [loadMoreRef, onLoadMore]);

  // Handle scrolling when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current && shouldScrollToLatest) {
      chatContainerRef.current.scrollTop = 0;
    }
  }, [lastMessageId, shouldScrollToLatest]);

  // Detect if user scrolled up
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // In flex-col-reverse, scrollTop === 0 means we're at the bottom (visually)
      const isAtBottom = container.scrollTop === 0;
      setShouldScrollToLatest(isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle scroll position when loading more messages
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container || prevMessagesLength.current === messages.length) {
      return;
    }

    // If we're loading older messages (messages increasing)
    if (messages.length > prevMessagesLength.current) {
      // Save current scroll position
      const previousScrollTop = container.scrollTop;
      const previousScrollHeight = container.scrollHeight;

      // After messages are rendered, adjust scroll to maintain position
      setTimeout(() => {
        const newScrollHeight = container.scrollHeight;
        const heightDifference = newScrollHeight - previousScrollHeight;
        // In flex-col-reverse, we need to add the height difference to maintain visual position
        container.scrollTop = previousScrollTop + heightDifference;
      }, 0);
    }

    prevMessagesLength.current = messages.length;
  }, [messages.length]);

  useEffect(() => {
    if (lastMessageId && messageRefs.current.has(lastMessageId)) {
      const element = messageRefs.current.get(lastMessageId);
      element?.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }, [lastMessageId]);

  return (
    <div
      ref={chatContainerRef}
      className="flex h-full w-full flex-1 flex-col-reverse overflow-y-auto rounded-md border p-4"
    >
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      <div className="space-y-4">
        <div className="h-px w-full" ref={loadMoreRef} />
        {messages.map(({ id, content, createdAt, sender }) => (
          <Message
            key={id}
            message={content}
            sent_at={new Date(createdAt)}
            owner={sender === socket?.id}
            ref={(el) => {
              if (el) {
                messageRefs.current.set(id, el);
              } else {
                messageRefs.current.delete(id);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};
