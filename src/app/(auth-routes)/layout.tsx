import { type ReactNode } from "react";
import { ThemeToggle } from "../../components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { DoorClosed, DoorOpen } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Header } from "../../components/landing/header";

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Header isLogout />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
