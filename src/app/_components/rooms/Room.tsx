import React from "react";
import { Chat } from "./Chat";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Room = () => {
  return (
    <div className="mx-auto flex h-full max-w-[1400px] flex-col gap-4 py-4">
      <Chat />
      <div className="flex items-center gap-2 rounded-md border p-4">
        <Input
          placeholder="Napisz wiadomość..."
          className="border-none bg-transparent outline-none"
        />
        <Button>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
