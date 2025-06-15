import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { rooms, messages } from "@/server/db/schema";
import { and, eq, lt, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const generateRoomCode = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const firstPart = Array.from({ length: 3 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length)),
  ).join("");
  const secondPart = Array.from({ length: 3 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length)),
  ).join("");
  return `${firstPart}-${secondPart}`;
};

export const roomRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Nazwa pokoju jest wymagana"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let roomCode = generateRoomCode();

      while (true) {
        const existingRoom = await ctx.db.query.rooms.findFirst({
          where: eq(rooms.roomCode, roomCode),
        });
        if (existingRoom) {
          roomCode = generateRoomCode();
        } else {
          break;
        }
      }

      await ctx.db.insert(rooms).values({
        name: input.name,
        userId: ctx.session.user.id,
        roomCode: roomCode,
      });
    }),

  infiniteList: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const cursor = input.cursor;

      const userRooms = await ctx.db.query.rooms.findMany({
        where: cursor
          ? and(eq(rooms.userId, ctx.session.user.id), lt(rooms.id, cursor))
          : eq(rooms.userId, ctx.session.user.id),
        orderBy: (rooms, { desc }) => [desc(rooms.id)],
        limit: limit + 1,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (userRooms.length > limit) {
        const nextItem = userRooms.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items: userRooms,
        nextCursor,
      };
    }),
  join: publicProcedure
    .input(
      z.object({
        otp: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.db.query.rooms.findFirst({
        where: eq(rooms.roomCode, input.otp),
      });

      if (!room) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pokój nie znaleziony",
        });
      }

      return room;
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
