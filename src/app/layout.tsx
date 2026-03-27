import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "../components/theme";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Live Feedback Wall",
  description:
    "Interaktywna ściana komentarzy do zbierania opinii w czasie rzeczywistym podczas prezentacji, warsztatów i spotkań.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <TRPCReactProvider>
            <main id="main-content">{children}</main>
          </TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
