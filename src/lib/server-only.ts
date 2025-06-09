import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/utils/auth";

export const getServerSession = async () => {
  return await auth.api.getSession({ headers: await headers() });
};

export const protectedRoute = async ({
  route,
  revert,
}: {
  route?: string;
  revert?: boolean;
}) => {
  const session = await getServerSession();
  if (!revert && !session) {
    return redirect(route ?? "/auth");
  }

  if (revert && session) {
    return redirect(route ?? "/");
  }
};
