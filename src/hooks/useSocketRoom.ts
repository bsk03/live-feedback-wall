import { useEffect } from "react";
import { socket } from "@/lib/socketClient";

interface Message {
  id: number;
  content: string;
  createdAt: Date;
  sender: string;
}

interface UseSocketRoomProps {
  roomId: string;
  onMessage: (data: { message: Message; sender: string }) => void;
  onUserJoined?: (data: { id: string }) => void;
}

export const useSocketRoom = ({
  roomId,
  onMessage,
  onUserJoined,
}: UseSocketRoomProps) => {
  useEffect(() => {
    if (!roomId) {
      console.log("❌ No roomId, skipping socket setup");
      return;
    }

    console.log("🔧 Setting up socket listeners for room:", roomId);

    const handleMessage = (data: { message: Message; sender: string }) => {
      console.log("📨 RECEIVED MESSAGE EVENT:", data);
      onMessage(data);
    };

    const handleUserJoined = (data: { id: string }) => {
      console.log(`👋 User ${data.id} joined room ${roomId}`);
      onUserJoined?.(data);
    };

    const handleConnect = () => {
      console.log("🔌 Socket connected!");
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected!");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("message", handleMessage);
    socket.on("user-joined", handleUserJoined);

    if (socket.connected) {
      console.log("🔌 Socket already connected, joining room");
      socket.emit("join-room", roomId);
    } else {
      console.log("🔌 Socket not connected, waiting for connection");
      socket.on("connect", () => {
        console.log("🔌 Socket connected, joining room");
        socket.emit("join-room", roomId);
      });
    }

    return () => {
      console.log("🧹 Cleaning up socket listeners");
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("message", handleMessage);
      socket.off("user-joined", handleUserJoined);
    };
  }, [roomId, onMessage, onUserJoined]);

  const sendMessage = (messageData: Message) => {
    console.log("📤 Sending message via socket:", messageData);
    console.log("📤 To room:", roomId);

    socket.emit("message", {
      message: messageData,
      roomId: roomId,
    });

    console.log("✅ Message emitted to server");
  };

  return {
    sendMessage,
    isConnected: socket.connected,
    socket,
  };
};
