"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import React from "react";

type Props = {
  name: string;
  code: string;
  createdAt: Date;
  isSelected?: boolean;
  onSelect?: () => void;
};

export const RoomTile = ({
  name,
  createdAt,
  code,
  isSelected,
  onSelect,
}: Props) => {
  return (
    <div
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-lg p-[1px]`}
    >
      <div
        className={cn(
          "absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 transition-opacity duration-300",
          isSelected ? "opacity-100" : "opacity-0",
          "group-hover:opacity-100",
        )}
      />
      <div className="bg-background relative flex h-full w-full items-center justify-between rounded-lg p-4">
        <div>
          <p className="text-lg font-bold">
            {name}{" "}
            <span className="text-muted-foreground text-sm font-normal">
              #{code}
            </span>
          </p>
          <p className="text-muted-foreground text-sm">
            {createdAt.toLocaleDateString()}
          </p>
        </div>
        <Button>
          <Eye /> Udostępnij pokój
        </Button>
      </div>
    </div>
  );
};
