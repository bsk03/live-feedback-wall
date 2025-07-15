import { FolderX } from "lucide-react";
import React from "react";

export const Empty = () => {
  return (
    <div className="border-muted-foreground/20 flex h-full flex-col items-center justify-center gap-4 p-8">
      <FolderX className="text-muted-foreground/50 h-12 w-12" />
      <p className="text-muted-foreground text-center text-sm">
        Nie znaleziono żadnych elementów
      </p>
    </div>
  );
};
