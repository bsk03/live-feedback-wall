import React, { useState, useEffect, useRef, useCallback } from "react";
import { Message } from "./Message";
import { api } from "@/trpc/react";
import { useSSE } from "@/hooks/useSSE";
import { useParams } from "next/navigation";
import { useChatScroll } from "@/hooks";

export const Chat = () => {
  const params = useParams();
  const roomId = (params?.roomId as string) || "1";
  const [messages, setMessages] = useState<
    Array<{
      id: number;
      content: string;
      createdAt: Date;
    }>
  >([]);
  const [cursor, setCursor] = useState<number | undefined>(undefined);

  const { data: initialMessages, refetch } = api.message.getMessages.useQuery({
    roomId: parseInt(roomId),
    perPage: 20,
    cursor: cursor,
  });

  const { containerRef, handleScroll, loadMoreRef } = useChatScroll(messages, {
    onLoadMore: () => {
      if (cursor && initialMessages?.hasMore) {
        // Trigger refetch with new cursor
        refetch();
      }
    },
    hasMore: initialMessages?.hasMore || false,
  });

  useEffect(() => {
    if (initialMessages) {
      if (cursor) {
        // Add older messages at the beginning
        setMessages((prev) => [...initialMessages.items, ...prev]);
      } else {
        // First load
        setMessages(initialMessages.items);
      }
      setCursor(initialMessages.nextCursor);
    }
  }, [initialMessages]);

  // Memoize the SSE message handler to prevent unnecessary reconnections
  const handleSSEMessage = useCallback((data: unknown) => {
    if (
      typeof data === "object" &&
      data &&
      "type" in data &&
      data.type === "new-message" &&
      "message" in data
    ) {
      // Add the new message directly to the state
      const newMessage = data.message as {
        id: number;
        content: string;
        createdAt: Date;
      };

      setMessages((prev) => {
        // Check if message already exists to avoid duplicates
        const exists = prev.some((msg) => msg.id === newMessage.id);
        if (exists) return prev;

        // Add new message at the end (newest messages at bottom)
        return [...prev, newMessage];
      });
    }
  }, []);

  useSSE({
    roomId,
    onMessage: handleSSEMessage,
  });

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-full w-full flex-1 overflow-y-auto rounded-md border p-4"
    >
      {/* {initialMessages?.hasMore && (
        <div
          ref={loadMoreRef}
          className="flex w-full items-center justify-center py-4"
        >
          <p className="text-sm text-gray-500">
            Wczytywanie starszych wiadomości...
          </p>
        </div>
      )} */}
      <div className="space-y-4">
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message.content}
            sent_at={message.createdAt}
          />
        ))}
      </div>
    </div>
  );
};
