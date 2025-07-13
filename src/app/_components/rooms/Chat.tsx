import type { Message as MessageType } from "@/app/rooms/[roomId]/page";
import { type RefObject, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { Message } from "./Message";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Chat = ({
  messages,
  socket,
  loadMoreRef,
  lastMessageId,
  isLoading,
}: {
  messages: MessageType[];
  socket: Socket | null;
  loadMoreRef: RefObject<HTMLDivElement>;
  lastMessageId: number | null;
  isLoading?: boolean;
}) => {
  const messageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  console.log(lastMessageId);
  useEffect(() => {
    if (lastMessageId && messageRefs.current.has(lastMessageId)) {
      const element = messageRefs.current.get(lastMessageId);
      console.log(lastMessageId, element);
      element?.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }, [lastMessageId, messages]);

  return (
    <div className="flex h-full w-full flex-1 flex-col-reverse overflow-y-auto rounded-md border p-4">
      <div className="space-y-4">
        <div className="h-px w-full" ref={loadMoreRef} />
        {isLoading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-12 w-20" />
                <Skeleton className="h-12 w-32" />
              </div>
            ))}
          </>
        ) : (
          messages.map(({ id, content, createdAt, sender }) => (
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
          ))
        )}
      </div>
    </div>
  );
};
