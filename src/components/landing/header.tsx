"use client";
import { Button } from "@/components/ui/button";
import {
  DoorOpen,
  MessageCircleIcon,
  MessageSquareCode,
  MessageSquareDiffIcon,
} from "lucide-react";
import React from "react";
import { ThemeToggle } from "../theme";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const Header = ({ isLogout }: { isLogout: boolean }) => {
  const router = useRouter();
  const logout = async () => {
    await authClient.signOut();
    router.push("/");
  };
  return (
    <header className="border-border/60 bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md">
      <nav
        aria-label="Nawigacja panelu"
        className="container mx-auto px-4 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="bg-foreground flex h-9 min-h-[2.25rem] w-9 min-w-[2.25rem] items-center justify-center rounded-lg"
              aria-hidden="true"
            >
              <MessageCircleIcon className="text-background h-5 w-5" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              Live Feedback Wall
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            {isLogout && (
              <Button
                variant="outline"
                onClick={() => logout()}
                aria-label="Wyloguj się"
              >
                <p className="hidden md:block">Wyloguj się</p>
                <DoorOpen aria-hidden="true" />
              </Button>
            )}

            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
};
