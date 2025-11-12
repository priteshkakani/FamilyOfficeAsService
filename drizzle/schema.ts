import { pgTable, serial, varchar, integer, jsonb } from 'drizzle-orm/pg-core';

export const familyMembers = pgTable('family_members', {
  id: serial('id').primaryKey(),
  household_id: integer('household_id').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  aadhar: varchar('aadhar', { length: 12 }),
  aadhar_masked: varchar('aadhar_masked', { length: 20 }),
  age: integer('age'),
  role: varchar('role', { length: 50 }),
  assets: varchar('assets', { length: 50 }),
  income: integer('income'),
});

export const assets = pgTable('assets', {
  id: serial('id').primaryKey(),
  household_id: integer('household_id').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  value: integer('value'),
  details: jsonb('details'),
});

export const liabilities = pgTable('liabilities', {
  id: serial('id').primaryKey(),
  household_id: integer('household_id').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  value: integer('value'),
});

export const cashflows = pgTable('cashflows', {
  id: serial('id').primaryKey(),
  household_id: integer('household_id').notNull(),
  source: varchar('source', { length: 50 }).notNull(),
  value: integer('value'),
});

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  household_id: integer('household_id').notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  value: integer('value'),
});
