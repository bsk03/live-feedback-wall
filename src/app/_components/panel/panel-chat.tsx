"use client";
import type { Message as MessageType } from "@/app/rooms/[roomId]/page";
import { Empty } from "@/app/_components/panel/empty";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { api } from "@/trpc/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Message } from "../rooms/Message";
import { Chat } from "../rooms/Chat";
import { useSocketRoom } from "@/hooks/useSocketRoom";

export const PanelChat = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [lastMessageId, setLastMessageId] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const selectedRoomId = searchParams?.get("room");

  const handleNewMessage = (data: { message: MessageType; sender: string }) => {
    setMessages((prevMessages) => {
      console.log("📝 Previous messages:", prevMessages);

      const exists = prevMessages.some((msg) => msg.id === data.message.id);
      if (exists) {
        console.log("⚠️  Message already exists, skipping");
        return prevMessages;
      }

      const newMessages = [...prevMessages, data.message].sort(
        (a, b) => a.id - b.id,
      );
      console.log("✅ New messages array:", newMessages);
      return newMessages;
    });
  };

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.message.getMessages.useInfiniteQuery(
    {
      roomId: selectedRoomId ? parseInt(selectedRoomId) : 0,
      perPage: 20,
    },
    {
      enabled: !!selectedRoomId,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { socket } = useSocketRoom({
    roomId: selectedRoomId ?? "",
    onMessage: handleNewMessage,
    onUserJoined: (data) => {
      console.log(`👋 User ${data.id} joined the room`);
    },
  });

  useEffect(() => {
    if (messagesData?.pages) {
      const allMessages = messagesData.pages.flatMap((page) => page.items);
      const sortedMessages = [...allMessages].sort((a, b) => a.id - b.id);
      setMessages(sortedMessages);
      setHasMore(!!hasNextPage);
    }
  }, [messagesData, hasNextPage]);

  const handleBeforeFetch = () => {
    if (messages.length > 0) {
      setLastMessageId(messages[0]?.id ?? null);
    }
  };

  const { loadMoreRef } = useInfiniteScroll(fetchNextPage, hasNextPage, {
    onBeforeFetch: handleBeforeFetch,
  });

  if (!selectedRoomId) {
    return <Empty />;
  }

  return (
    <div className="col-span-3 flex w-full flex-col gap-8 overflow-hidden">
      <div className="flex h-full flex-1 flex-col gap-4">
        <p className="text-3xl font-bold">Podgląd</p>
        <Chat
          messages={messages}
          socket={socket}
          loadMoreRef={loadMoreRef}
          isLoading={isLoadingMessages}
          lastMessageId={lastMessageId}
        />
      </div>
    </div>
  );
};
