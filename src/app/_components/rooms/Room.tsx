import type { Message } from "@/app/rooms/[roomId]/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import { Check, Loader2, Send } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState, type RefObject } from "react";
import { Socket } from "socket.io-client";
import { Chat } from "./Chat";

export const Room = ({
  handleSendMessage,
  messages,
  socket,
  loadMoreRef,
  lastMessageId,
}: {
  handleSendMessage: (message: string) => void;
  messages: Message[];
  socket: Socket;
  loadMoreRef: RefObject<HTMLDivElement>;
  lastMessageId: number | null;
}) => {
  const params = useParams();
  const roomId = (params?.roomId as string) || "1";
  const [message, setMessage] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="container mx-auto flex h-full flex-col gap-4 px-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Room {roomId}</h2>
        <div className="flex items-center gap-2">
          {socket.connected ? (
            <p className="flex flex-row items-center gap-2 text-sm text-green-500">
              Połączono <Check className="h-4 w-4" />
            </p>
          ) : (
            <p className="flex flex-row items-center gap-2 text-sm text-orange-500">
              Łączenie <Loader2 className="h-4 w-4 animate-spin" />
            </p>
          )}
        </div>
      </div>
      <Chat
        messages={messages}
        socket={socket}
        loadMoreRef={loadMoreRef}
        lastMessageId={lastMessageId}
      />
      <div className="flex items-center gap-2 rounded-md border p-4">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Napisz wiadomość..."
          className="border-none bg-transparent outline-none"
        />
        <Button
          onClick={() => {
            handleSendMessage(message);
            setMessage("");
          }}
          disabled={!message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
