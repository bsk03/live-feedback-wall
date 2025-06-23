import React, { useState } from "react";
import { Chat } from "./Chat";
import { Input } from "@/components/ui/input";
import { Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";

export const Room = () => {
  const params = useParams();
  const roomId = (params?.roomId as string) || "1";
  const [message, setMessage] = useState("");

  const { mutate: sendMessage } = api.message.sendMessage.useMutation({
    onSuccess: () => {
      setMessage(""); // Clear input after sending
    },
  });

  const { mutate: generateTestMessages } =
    api.message.generateTestMessages.useMutation();

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage({
        message: message.trim(),
        roomId: parseInt(roomId),
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleGenerateTestMessages = () => {
    generateTestMessages({ roomId: parseInt(roomId), count: 30 });
  };

  return (
    <div className="mx-auto flex h-full max-w-[1400px] flex-col gap-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Room {roomId}</h2>
        <Button
          onClick={handleGenerateTestMessages}
          variant="outline"
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Generate Test Messages
        </Button>
      </div>
      <Chat />
      <div className="flex items-center gap-2 rounded-md border p-4">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Napisz wiadomość..."
          className="border-none bg-transparent outline-none"
        />
        <Button onClick={handleSendMessage} disabled={!message.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
