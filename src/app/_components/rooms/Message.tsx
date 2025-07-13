import { forwardRef } from "react";

export const Message = forwardRef<
  HTMLDivElement,
  {
    message: string;
    sent_at: Date;
    owner: boolean;
  }
>(({ message, sent_at, owner }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex w-full flex-col gap-2 ${
        owner ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`max-w-[70%] rounded-xl p-3 ${
          owner
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-black dark:bg-gray-800 dark:text-white"
        }`}
      >
        <p className="break-words">{message}</p>
      </div>
      <p className="text-xs text-gray-500">
        {sent_at.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
});

Message.displayName = "Message";
