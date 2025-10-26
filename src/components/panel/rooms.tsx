"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Empty } from "./empty";
import { RoomTile } from "./room-tile";

export const Rooms = () => {
  const searchParams = useSearchParams();
  const selectedRoomId = searchParams?.get("room");
  const router = useRouter();
  const [page, setPage] = useState(1);

  const selectRoom = (id: number) => {
    router.push(`/panel?room=${id}`, { scroll: false });
  };

  const { data, isLoading } = api.room.list.useQuery({
    page,
    limit: 10,
  });

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

  const rooms = data?.items ?? [];
  const totalPages = data?.totalPages ?? 0;
  const currentPage = data?.currentPage ?? 1;

  return (
    <div className="flex h-full flex-col gap-4">
      <p className="text-3xl font-bold">Twoje pokoje</p>
      <div className="border-border flex flex-1 flex-col gap-4 overflow-y-auto rounded-sm border p-4">
        {rooms.length === 0 ? (
          <Empty />
        ) : (
          rooms.map((room) => (
            <RoomTile
              key={room.id}
              {...room}
              code={room.roomCode}
              isSelected={selectedRoomId === room.id.toString()}
              onSelect={() => selectRoom(room.id)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Poprzednia
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Następna
          </Button>
        </div>
      )}
    </div>
  );
};
