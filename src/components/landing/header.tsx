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
    <header className="sticky top-0 z-50 container mx-auto bg-transparent px-4 py-6 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 min-h-[2.5rem] w-10 min-w-[2.5rem] items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <MessageCircleIcon color="white" className="h-6 w-6" />
          </div>
          <h1 className="text-lg font-bold sm:text-2xl">Live Feedback Wall</h1>
        </div>
        <div className="flex items-center space-x-2">
          {isLogout && (
            <Button variant="outline" onClick={() => logout()}>
              <p className="hidden md:block">Wyloguj się</p>
              <DoorOpen />
            </Button>
          )}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
