"use client";

import { useEffect, useRef } from "react";
import { useQRCode } from "next-qrcode";

interface QRGeneratorProps {
  roomId: string;
}

export default function QRGenerator({ roomId }: QRGeneratorProps) {
  const { Canvas } = useQRCode();
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/room/join?id=${roomId}`;

  return (
    <div>
      <Canvas
        text={url}
        options={{
          errorCorrectionLevel: "H",
          margin: 2,
          scale: 4,
          width: 200,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        }}
      />
    </div>
  );
}
