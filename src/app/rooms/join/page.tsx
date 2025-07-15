import { Header } from "@/components/landing/header";
import { RoomJoin } from "@/components/rooms/RoomJoin";

export default async function JoinRoom({
  searchParams,
}: {
  searchParams: { roomId: string };
}) {
  const { roomId } = await searchParams;

  return <RoomJoin roomId={roomId} />;
}
