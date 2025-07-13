import React from "react";
import { Rooms } from "./rooms";
import { PanelChat } from "./panel-chat";
import { CreateRoomTile } from "./create-room-tile";
import { getServerSession, protectedRoute } from "@/lib/server-only";

export const Panel = async () => {
  const session = await getServerSession();
  console.log(session);
  return (
    <div className="relative h-[calc(100vh-88px)]">
      <div className="from-background via-background to-muted absolute inset-0 -z-20 bg-gradient-to-br" />
      <div className="mx-auto h-full max-w-[1400px] p-4">
        <div className="grid h-full grid-cols-5 gap-16">
          <div className="col-span-2 flex min-h-0 flex-col gap-8">
            <div className="flex-shrink-0">
              <CreateRoomTile />
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <Rooms />
            </div>
          </div>
          <PanelChat />
        </div>
      </div>
    </div>
  );
};
