import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { messages } from "@/server/db/schema";
import { and, desc, eq, lt } from "drizzle-orm";

export const messageRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(
      z.object({
        message: z.string(),
        roomId: z.number(),
        sender: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const msg = {
        roomId: +input.roomId,
        content: input.message,
        sender: input.sender,
      };

      const result = await ctx.db.insert(messages).values(msg).returning();

      return result;
    }),
  getMessages: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
        perPage: z.number().optional().default(20),
        cursor: z.number().optional(),
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
          sender: messages.sender,
        })
        .from(messages)
        .where(and(...conditions))
        .orderBy(desc(messages.id))
        .limit(input.perPage + 1);

      let nextCursor: typeof input.cursor | undefined = undefined;
      let hasMore = false;

      if (messagesData.length > input.perPage) {
        const nextItem = messagesData.pop();
        nextCursor = nextItem!.id;
        hasMore = true;
      }

      return {
        items: messagesData,
        nextCursor,
        hasMore,
      };
    }),
  getMessage: publicProcedure
    .input(z.object({ messageId: z.number() }))
    .query(async ({ input, ctx }) => {
      const message = await ctx.db
        .select()
        .from(messages)
        .where(eq(messages.id, input.messageId))
        .orderBy(desc(messages.createdAt));
      return message;
    }),
  generateTestMessages: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
        count: z.number().optional().default(30),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const testMessages = Array.from({ length: input.count }, (_, i) => ({
        roomId: input.roomId,
        content: `Test message ${i + 1} - ${new Date().toISOString()}`,
        createdAt: new Date(Date.now() - (input.count - i) * 60000),
        sender: "test-user",
      }));

      const result = await ctx.db
        .insert(messages)
        .values(testMessages)
        .returning();
      return result;
    }),
});
