"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { api } from "@/trpc/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Empty } from "./empty";
import { RoomTile } from "./room-tile";

export const Rooms = () => {
  const searchParams = useSearchParams();
  const selectedRoomId = searchParams?.get("room");
  const router = useRouter();

  const selectRoom = (id: number) => {
    router.push(`/panel?room=${id}`, { scroll: false });
  };

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    api.room.infiniteList.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const { loadMoreRef } = useInfiniteScroll(fetchNextPage, hasNextPage);

  if (isLoading) {
    return (
      <div className="flex h-full flex-col gap-4">
        <p className="text-3xl font-bold">Twoje pokoje </p>
        <div className="border-border flex flex-1 flex-col gap-4 overflow-y-auto rounded-sm border p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const allRooms = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="flex h-full flex-col gap-4">
      <p className="text-3xl font-bold">Twoje pokoje</p>
      <div className="border-border flex flex-1 flex-col gap-4 overflow-y-auto rounded-sm border p-4">
        {allRooms.length === 0 ? (
          <Empty />
        ) : (
          allRooms.map((room) => (
            <RoomTile
              key={room.id}
              {...room}
              code={room.roomCode}
              isSelected={selectedRoomId === room.id.toString()}
              onSelect={() => selectRoom(room.id)}
            />
          ))
        )}
        {isFetchingNextPage && (
          <div className="flex flex-1 items-center justify-center">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}{" "}
          </div>
        )}
        {hasNextPage && !isFetchingNextPage && <div ref={loadMoreRef} />}
      </div>
    </div>
  );
};
