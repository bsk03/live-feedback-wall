"use client";
import { Button } from "@/components/ui/button";
import React from "react";

export const CreateRoomTile = () => {
  return (
    <div className="group relative rounded-lg p-[1px]">
      <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 transition-opacity duration-300" />
      <div className="bg-background relative flex h-full w-full items-center justify-between rounded-lg p-6">
        <p className="text-xl font-bold">Stwórz własną przestrzeń</p>
        <Button>Stwórz</Button>
      </div>
    </div>
  );
};
