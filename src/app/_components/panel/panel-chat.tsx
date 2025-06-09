import React from "react";
import { Empty } from "./empty";

export const PanelChat = () => {
  return (
    <div className="col-span-3 flex flex-col gap-8">
      <div className="flex flex-1 flex-col gap-4">
        <p className="text-3xl font-bold">Podgląd</p>
        <div className="border-border flex h-full flex-col gap-4 rounded-sm border">
          <Empty />
        </div>
      </div>
    </div>
  );
};
