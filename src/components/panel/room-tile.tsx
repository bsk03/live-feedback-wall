"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy, Eye } from "lucide-react";
import React, { useState } from "react";
import { Poup } from "../popup/Poup";
import QRGenerator from "../qr-generator/QrGenerator";
import { toast } from "sonner";
import { CopyButton } from "../shared/copy-button";

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
  const [open, setOpen] = useState(false);
  return (
    <>
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
            <div className="flex w-full items-center gap-2">
              <p className="line-clamp-1 max-w-[70%] text-lg font-bold">
                {name}{" "}
              </p>
              <span className="text-muted-foreground text-sm font-normal">
                #{code}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              {createdAt.toLocaleDateString()}
            </p>
          </div>
          <Poup
            trigger={
              <Button>
                <Eye /> Udostępnij pokój
              </Button>
            }
            header="Udostępnij pokój"
            description="Podaj link do pokoju innym użytkownikom"
            open={open}
            setOpen={setOpen}
          >
            <div className="flex flex-col items-center justify-center gap-8">
              <QRGenerator
                roomId={`${process.env.NEXT_PUBLIC_SITE_URL}/rooms/join?roomId=${code}`}
              />
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-5xl">{code}</p>
                <div className="flex flex-col items-center justify-center gap-2">
                  <p className="text-sm">Lub skopiuj link</p>
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-sm">
                      {`${process.env.NEXT_PUBLIC_SITE_URL}/rooms/join?roomId=${code}`}
                    </p>
                    <CopyButton
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${process.env.NEXT_PUBLIC_SITE_URL}/rooms/join?roomId=${code}`,
                        );
                        toast.success("Link skopiowany do schowka");
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Poup>
        </div>
      </div>
    </>
  );
};
