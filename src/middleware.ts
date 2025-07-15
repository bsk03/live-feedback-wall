import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("better-auth.session_token");
  const pathname = request.nextUrl.pathname;
  if (sessionToken && pathname === "/auth") {
    return NextResponse.redirect(new URL("/panel", request.url));
  }

  if (!sessionToken && pathname === "/panel") {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel", "/auth"],
};
