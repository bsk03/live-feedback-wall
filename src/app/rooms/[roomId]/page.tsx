"use client";
import { Header } from "@/app/_components/landing/header";
import { Room } from "@/app/_components/rooms/Room";
import { checkRoom } from "@/utils/room";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";
import { useInfiniteScroll } from "@/hooks";
import { useSocketRoom } from "@/hooks/useSocketRoom";
import { Loader2 } from "lucide-react";

export type Message = {
  id: number;
  content: string;
  createdAt: Date;
  sender: string;
};

const RoomPage = () => {
  const params = useParams();
  const roomId = params?.roomId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [lastMessageId, setLastMessageId] = useState<number | null>(null);
  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = api.message.getMessages.useInfiniteQuery(
    {
      roomId: parseInt(roomId),
      perPage: 20,
    },
    {
      enabled: !!roomId,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  useEffect(() => {
    if (messagesData?.pages) {
      const allMessages = messagesData.pages.flatMap((page) => page.items);

      const sortedMessages = [...allMessages].sort((a, b) => a.id - b.id);

      setMessages(sortedMessages);
      setHasMore(!!hasNextPage);
      setLastMessageId(sortedMessages[0]?.id ?? null);
    }
  }, [messagesData, hasNextPage]);

  const handleNewMessage = (data: { message: Message; sender: string }) => {
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

  const { sendMessage, socket } = useSocketRoom({
    roomId,
    onMessage: handleNewMessage,
    onUserJoined: (data) => {
      console.log(`👋 User ${data.id} joined the room`);
    },
  });

  const createMessage = api.message.sendMessage.useMutation({
    onSuccess: (data) => {
      if (data[0]) {
        const messageData = {
          id: data[0].id,
          content: data[0].content,
          sender: data[0].sender,
          createdAt: new Date(),
        };
        sendMessage(messageData);
      }
    },
    onError: (error) => {
      console.error("❌ Error sending message:", error);
    },
  });

  const handleSendMessage = (message: string) => {
    if (message.trim() === "") return;

    console.log("📝 Sending message:", message);
    createMessage.mutate({
      message,
      roomId: parseInt(roomId),
      sender: socket?.id || "",
    });
  };

  const { loadMoreRef } = useInfiniteScroll(async () => {
    if (!hasMore || isLoadingMessages || isFetchingNextPage) return;
    console.log("fetching more messages");
    await fetchNextPage();
  }, hasMore);

  return (
    <div className="flex h-screen flex-col">
      <div className="h-full">
        {isLoadingMessages ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Room
            handleSendMessage={handleSendMessage}
            messages={messages}
            socket={socket}
            loadMoreRef={loadMoreRef}
            lastMessageId={lastMessageId}
          />
        )}
      </div>
    </div>
  );
};

export default RoomPage;
