"use client";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React from "react";
import { CreateRoomPopup } from "./create-room-popup";

export const CreateRoomTile = () => {
  return (
    <div className="bg-card border-border rounded-lg border">
      <div className="relative flex h-full w-full items-center justify-between rounded-lg p-6">
        <p className="text-xl font-bold">Stwórz własną przestrzeń</p>
        <CreateRoomPopup>
          <Button>Stwórz</Button>
        </CreateRoomPopup>
      </div>
    </div>
  );
};
