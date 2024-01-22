import { relations } from 'drizzle-orm';
import { serial, varchar, date, unique } from 'drizzle-orm/pg-core';
import { pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey().unique(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  profile: varchar('profile', { length: 256 }).unique(),
  createdAt: date('createdAt').defaultNow().notNull(),
  updatedAt: date('updatedAt').defaultNow().notNull(),
});

export const strategies = pgTable('strategies', {
  id: serial('id').primaryKey(),
  user_id: serial('user_id')
    .references(() => users.id)
    .unique(),
  strategy: varchar('strategy', {
    length: 256,
    enum: ['google', 'github', 'local'],
  }),
});

export const passwords = pgTable('password', {
  id: serial('id').primaryKey(),
  user_id: serial('user_id').references(() => users.id),
  password: varchar('password').notNull(),
});

export const userRelation = relations(users, ({ one }) => ({
  strategy: one(strategies),
  password: one(passwords),
}));
export const strategyRelation = relations(strategies, ({ one }) => ({
  user: one(users, {
    fields: [strategies.user_id],
    references: [users.id],
  }),
}));
export const passwordRelation = relations(passwords, ({ one }) => ({
  user: one(users, {
    fields: [passwords.user_id],
    references: [users.id],
  }),
}));
