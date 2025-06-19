import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { messages } from "@/server/db/schema";
import { and, desc, eq, lt } from "drizzle-orm";

export const messageRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(z.object({ message: z.string(), roomId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const msg = {
        roomId: +input.roomId,
        content: input.message,
      };
      return ctx.db.insert(messages).values(msg);
    }),
  getMessages: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
        limit: z.number().optional().default(50),
        cursor: z.number().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const conditions = [eq(messages.roomId, input.roomId)];

      if (input.cursor) {
        conditions.push(lt(messages.id, input.cursor));
      }

      return ctx.db
        .select()
        .from(messages)
        .where(and(...conditions))
        .orderBy(desc(messages.createdAt))
        .limit(input.limit);
    }),
});
