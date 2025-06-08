// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `live-feedback-wall_${name}`,
);

export const users = createTable(
  "user",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    email: d.varchar({ length: 256 }).notNull().unique(),
    password: d.varchar({ length: 256 }).notNull(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("email_idx").on(t.email)],
);

export const usersRelations = relations(users, ({ many }) => ({
  rooms: many(rooms),
}));

export const rooms = createTable(
  "room",
  (d) => ({
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
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  }),
  (t) => [index("name_idx").on(t.name)],
);

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  user: one(users, {
    fields: [rooms.userId],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messages = createTable(
  "message",
  (d) => ({
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
  }),
  (t) => [index("room_id_idx").on(t.roomId)],
);

export const messagesRelations = relations(messages, ({ one }) => ({
  room: one(rooms, {
    fields: [messages.roomId],
    references: [rooms.id],
  }),
}));
