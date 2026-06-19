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
            ? "bg-foreground text-background"
            : "bg-muted text-foreground border-border border"
        }`}
      >
        <p className="break-words">{message}</p>
      </div>
      <p className="text-muted-foreground text-xs">
        {sent_at.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
});

Message.displayName = "Message";
