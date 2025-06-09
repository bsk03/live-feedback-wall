import { relations, sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";
import { rooms } from "./room";

export const messages = pgTable("message", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  roomId: d
    .integer()
    .references(() => rooms.id, { onDelete: "cascade" })
    .notNull(),
  content: d.varchar({ length: 256 }).notNull(),
  createdAt: d
    .timestamp({ withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  deletedAt: d.timestamp({ withTimezone: true }),
  deleted: d.boolean().notNull().default(false),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  room: one(rooms, {
    fields: [messages.roomId],
    references: [rooms.id],
  }),
}));
