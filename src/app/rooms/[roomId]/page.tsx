"use client";
import { Header } from "@/app/_components/landing/header";
import { Room } from "@/app/_components/rooms/Room";
import { checkRoom } from "@/utils/room";
import { redirect, useParams } from "next/navigation";

const RoomPage = () => {
  const { roomId }: { roomId: string } = useParams();
  console.log("params", roomId);
  const isRoom = checkRoom(+roomId);
  if (!isRoom) {
    return redirect("/rooms/join");
  }
  // const roomid = params.roomId;
  //   const room = await db.query.rooms.findFirst({
  // where: eq(rooms.roomCode, roomid),
  //   });
  return (
    <div className="flex h-screen flex-col">
      {/* <Header isLogout={false} /> */}
      <div className="h-full">
        <Room />
      </div>
    </div>
  );
};

export default RoomPage;
