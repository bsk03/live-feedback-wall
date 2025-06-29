"use client";
import { Header } from "@/app/_components/landing/header";
import { Room } from "@/app/_components/rooms/Room";
import { checkRoom } from "@/utils/room";
import { redirect, useParams } from "next/navigation";
import { socket } from "@/lib/socketClient";
import { useEffect, useState } from "react";

const RoomPage = () => {
  const { roomId }: { roomId: string } = useParams();
  console.log("params", roomId);
  const [messages, setMessages] = useState<string[]>([]);
  useEffect(() => {
    // const isRoom = checkRoom(roomId);
    // if (!isRoom) {
    //   return redirect("/rooms/join");
    // }
    socket.on("message", (message: string) => {
      console.log(`message ${message} received`);
    });
    socket.on("user_joined", (userId: string) => {
      console.log(`user ${userId} joined room ${roomId}`);
    });
    socket.emit("join-room", roomId);
    return () => {
      socket.off("user_joined");
      socket.off("message");
    };
  }, [roomId]);

  const handleSendMessage = (message: string) => {
    if (message.trim() === "") return;
    socket.emit("message", { roomId, message, sender: "user" });
    setMessages([...messages, message]);
  };
  // const roomid = params.roomId;
  //   const room = await db.query.rooms.findFirst({
  // where: eq(rooms.roomCode, roomid),
  //   });
  return (
    <div className="flex h-screen flex-col">
      {/* <Header isLogout={false} /> */}
      <div className="h-full">
        <Room handleSendMessage={handleSendMessage} messages={messages} />
      </div>
    </div>
  );
};

export default RoomPage;
