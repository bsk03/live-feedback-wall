import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { messages, user } from "@/server/db/schema";
import { and, desc, eq, lt, count, asc, gt } from "drizzle-orm";

export const messageRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(
      z.object({
        message: z.string(),
        roomId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const msg = {
        roomId: +input.roomId,
        content: input.message,
      };

      const result = await ctx.db.insert(messages).values(msg).returning();

      // Notify SSE connections about new message
      try {
        const { notifyRoom } = await import("@/app/api/events/route");
        notifyRoom(input.roomId.toString(), result[0]);
      } catch (error) {
        console.error("Failed to notify SSE connections:", error);
      }

      return result;
    }),
  getMessages: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
        perPage: z.number().optional().default(20),
        cursor: z.number().optional(), // Cursor for pagination (message ID)
      }),
    )
    .query(async ({ input, ctx }) => {
      const conditions = [eq(messages.roomId, input.roomId)];

      if (input.cursor) {
        conditions.push(lt(messages.id, input.cursor));
      }

      const messagesData = await ctx.db
        .select({
          id: messages.id,
          content: messages.content,
          createdAt: messages.createdAt,
        })
        .from(messages)
        .where(and(...conditions))
        .orderBy(desc(messages.createdAt))
        .limit(input.perPage + 1);

      let nextCursor: typeof input.cursor | undefined = undefined;
      let hasMore = false;

      if (messagesData.length > input.perPage) {
        const nextItem = messagesData.pop();
        nextCursor = nextItem!.id;
        hasMore = true;
      }

      const items = messagesData.reverse();

      return {
        items,
        nextCursor,
        hasMore,
      };
    }),
  generateTestMessages: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
        count: z.number().optional().default(30),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const testMessages = [];
      for (let i = 1; i <= input.count; i++) {
        testMessages.push({
          roomId: input.roomId,
          content: `Test message ${i} - ${new Date().toISOString()}`,
          createdAt: new Date(Date.now() - (input.count - i) * 60000), // Each message 1 minute apart
        });
      }

      const result = await ctx.db
        .insert(messages)
        .values(testMessages)
        .returning();
      return result;
    }),
});
