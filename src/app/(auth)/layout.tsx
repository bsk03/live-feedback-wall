import { protectedRoute } from "@/lib/server-only";
import { type ReactNode } from "react";
const Layout = async ({ children }: { children: ReactNode }) => {
  await protectedRoute({ route: "/", revert: false });

  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};

export default Layout;
