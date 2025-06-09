import { relations, sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { messages } from "./message";

export const rooms = pgTable("room", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 256 }).notNull(),
  roomCode: d.varchar({ length: 7 }).notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  userId: d
    .integer()
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  user: one(user, {
    fields: [rooms.userId],
    references: [user.id],
  }),
  messages: many(messages),
}));

export type Room = typeof rooms.$inferSelect;
