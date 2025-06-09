"use client";
import React from "react";
import { Empty } from "./empty";
import { RoomTile } from "./room-tile";
import { useRouter, useSearchParams } from "next/navigation";

const rooms = [
  { id: 1, name: "Pokój 1", createdAt: new Date(), code: "123456" },
  { id: 2, name: "Pokój 2", createdAt: new Date(), code: "123456" },
  { id: 3, name: "Pokój 3", createdAt: new Date(), code: "123456" },
  { id: 4, name: "Pokój 4", createdAt: new Date(), code: "123456" },
  { id: 5, name: "Pokój 5", createdAt: new Date(), code: "123456" },
  { id: 6, name: "Pokój 6", createdAt: new Date(), code: "123456" },
  { id: 7, name: "Pokój 7", createdAt: new Date(), code: "123456" },
  { id: 8, name: "Pokój 8", createdAt: new Date(), code: "123456" },
  { id: 9, name: "Pokój 9", createdAt: new Date(), code: "123456" },
  { id: 10, name: "Pokój 10", createdAt: new Date(), code: "123456" },
  { id: 11, name: "Pokój 11", createdAt: new Date(), code: "123456" },
  { id: 12, name: "Pokój 12", createdAt: new Date(), code: "123456" },
  { id: 13, name: "Pokój 13", createdAt: new Date(), code: "123456" },
  { id: 14, name: "Pokój 14", createdAt: new Date(), code: "123456" },
  { id: 15, name: "Pokój 15", createdAt: new Date(), code: "123456" },
  { id: 16, name: "Pokój 16", createdAt: new Date(), code: "123456" },
  { id: 17, name: "Pokój 17", createdAt: new Date(), code: "123456" },
];

export const Rooms = () => {
  const searchParams = useSearchParams();
  const selectedRoomId = searchParams.get("room");
  const router = useRouter();

  const selectRoom = (id: number) => {
    router.push(`/panel?room=${id}`, { scroll: false });
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <p className="text-3xl font-bold">Twoje pokoje</p>
      <div className="border-border flex flex-col gap-4 overflow-y-auto rounded-sm border p-4">
        {rooms.map((room) => (
          <RoomTile
            key={room.id}
            {...room}
            isSelected={selectedRoomId === room.id.toString()}
            onSelect={() => selectRoom(room.id)}
          />
        ))}
      </div>
    </div>
  );
};
