import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const { appRouter } = await import("@/server/api/root");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { renderTrpcPanel } = require("trpc-ui");

    return new NextResponse(
      renderTrpcPanel(appRouter, {
        url: "/api/trpc",
        transformer: "superjson",
      }),
      {
        status: 200,
        headers: [["Content-Type", "text/html"] as [string, string]],
      },
    );
  } catch {
    return new NextResponse("Dev panel unavailable", { status: 500 });
  }
}
