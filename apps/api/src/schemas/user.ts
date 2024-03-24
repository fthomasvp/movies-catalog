import { createId } from '@paralleldrive/cuid2';
import {
  boolean,
  index,
  pgTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const user = pgTable(
  'user',
  {
    id: text('show_id').$defaultFn(() => createId()),
    firstName: text('first_name'),
    lastName: text('last_name'),
    email: text('email'),
    password: text('password'),
    isActive: boolean('is_active').$defaultFn(() => true),
    createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
  },
  user => ({
    emailIndex: uniqueIndex('email_idx').on(user.email),
    firstName: index('first_name_idx').on(user.firstName),
    lastName: index('last_name_idx').on(user.lastName),
  }),
);

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type UserId = NonNullable<User['id']>;
