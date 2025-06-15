import { Header } from "@/app/_components/landing/header";
import { RoomJoin } from "@/app/_components/rooms/RoomJoin";

export default async function JoinRoom({
  searchParams,
}: {
  searchParams: { roomId: string };
}) {
  const { roomId } = await searchParams;

  return <RoomJoin roomId={roomId} />;
}
