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
          <a
            href="#main-content"
            className="bg-primary text-primary-foreground fixed left-2 top-2 z-[200] -translate-y-full rounded-md px-4 py-2 transition-transform focus:translate-y-0"
          >
            Przejdź do treści
          </a>
          <TRPCReactProvider>
            <main id="main-content">{children}</main>
          </TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
