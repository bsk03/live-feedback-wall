import { Check, Copy } from "lucide-react";
import React, { useState } from "react";

export const CopyButton = ({ onClick }: { onClick: () => void }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleClick = () => {
    onClick();
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  return (
    <button className="cursor-pointer" onClick={handleClick}>
      {isCopied ? <Check /> : <Copy />}
    </button>
  );
};
