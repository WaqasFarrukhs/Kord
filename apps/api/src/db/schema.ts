import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
// Infrastructure metadata only. Identity/domain tables arrive with their access controls.
export const applicationMetadata = pgTable('application_metadata', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
