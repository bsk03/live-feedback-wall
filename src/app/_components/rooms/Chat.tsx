import React from "react";
import { Message } from "./Message";

export const Chat = () => {
  return (
    <div className="h-full w-full flex-1 rounded-md border p-4">
      <Message message="test" sent_at={new Date()} />
    </div>
  );
};
