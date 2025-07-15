"use client";
import React, { useState } from "react";
import { Rooms } from "./rooms";
import { PanelChat } from "./panel-chat";
import { CreateRoomTile } from "./create-room-tile";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Panel = () => {
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  return (
    <div className="relative h-[calc(100vh-88px)]">
      <div className="from-background via-background to-muted absolute inset-0 -z-20 bg-gradient-to-br" />
      <div className="mx-auto h-full max-w-[1400px] p-4">
        <div className="grid h-full grid-cols-5 gap-0 lg:gap-16">
          <div className="col-span-2 hidden min-h-0 flex-col gap-8 lg:flex">
            <div className="hidden flex-shrink-0 lg:block">
              <CreateRoomTile />
            </div>
            <div className="hidden min-h-0 flex-1 overflow-hidden lg:block">
              <Rooms />
            </div>
          </div>

          <div
            className={cn(
              "bg-background fixed inset-y-0 right-0 z-[101] w-full transform overflow-y-auto transition-transform duration-300 ease-in-out lg:hidden",
              isMobilePanelOpen ? "translate-x-0" : "translate-x-full",
            )}
          >
            <div className="flex h-full flex-col p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Lista pokoi</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={() => setIsMobilePanelOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex-shrink-0">
                <CreateRoomTile />
              </div>
              <div className="mt-4 flex-1 overflow-hidden">
                <Rooms />
              </div>
            </div>
          </div>

          <PanelChat onShowMobilePanel={() => setIsMobilePanelOpen(true)} />
        </div>
      </div>
    </div>
  );
};
