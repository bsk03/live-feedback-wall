import { useParams } from "next/navigation";
import { useState } from "react";
import { Message } from "./Message";

export const Chat = ({ messages }: { messages: string[] }) => {
  const [messages2, setMessages2] = useState<
    Array<{
      id: number;
      content: string;
      createdAt: Date;
    }>
  >([]);

  return (
    <div
      // ref={containerRef}
      // onScroll={handleScroll}
      className="h-full w-full flex-1 overflow-y-auto rounded-md border p-4"
    >
      <div className="space-y-4">
        {messages.map((message, index) => (
          <Message
            key={`${message}-${index}`}
            message={message}
            sent_at={new Date()}
          />
        ))}
      </div>
    </div>
  );
};
