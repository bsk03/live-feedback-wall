import { EyeOffIcon } from "lucide-react";

type MessageType = {
  message: string;
  sent_at: Date;
};

export const Message = ({ message, sent_at }: MessageType) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="group w-[80%]">
      <div className="rounded-md border p-4">{message}</div>
      <div className="flex flex-row justify-between pt-2 pl-2">
        <p className="text-sm text-gray-500">{formatTime(sent_at)}</p>
        <button className="flex cursor-pointer flex-row items-center gap-2 border border-transparent text-sm text-red-500 opacity-0 group-hover:opacity-[100] hover:border-b-red-500">
          Ukryj
          <EyeOffIcon size={16} />
        </button>
      </div>
    </div>
  );
};
