import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { rooms, messages } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export const roomRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Nazwa pokoju jest wymagana"),
        userId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(rooms).values({
        name: input.name,
        userId: input.userId,
      });
    }),

  list: publicProcedure
    .input(
      z.object({
        userId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userRooms = await ctx.db.query.rooms.findMany({
        where: eq(rooms.userId, input.userId),
        with: {
          messages: true,
        },
      });

      return userRooms;
    }),

  getMessages: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const roomMessages = await ctx.db.query.messages.findMany({
        where: and(
          eq(messages.roomId, input.roomId),
          eq(messages.deleted, false),
        ),
        orderBy: (messages, { desc }) => [desc(messages.createdAt)],
      });

      return roomMessages;
    }),

  sendMessage: publicProcedure
    .input(
      z.object({
        roomId: z.number(),
        content: z.string().min(1, "Wiadomość nie może być pusta"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(messages).values({
        roomId: input.roomId,
        content: input.content,
      });
    }),
});
