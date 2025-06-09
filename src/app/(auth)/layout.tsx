import { protectedRoute } from "@/lib/server-only";
import { type ReactNode } from "react";
import { ThemeToggle } from "../_components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { DoorClosed, DoorOpen } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Header } from "../_components/landing/header";
const Layout = async ({ children }: { children: ReactNode }) => {
  await protectedRoute({ route: "/", revert: false });
  const logout = async () => {
    await authClient.signOut();
  };
  return (
    <div>
      <Header isLogout />
      <div>{children}</div>
    </div>
  );
};

export default Layout;
