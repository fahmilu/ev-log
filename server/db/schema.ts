import { date, doublePrecision, integer, pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const chargeLocation = pgEnum('charge_location', ['home', 'spklu'])

// Single-row table (id is always 1).
export const settings = pgTable('settings', {
  id: integer('id').primaryKey().default(1),
  batteryKwh: doublePrecision('battery_kwh').notNull(),
  priceHomePerKwh: doublePrecision('price_home_per_kwh').notNull(),
  priceSpkluPerKwh: doublePrecision('price_spklu_per_kwh').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const chargingSessions = pgTable('charging_sessions', {
  id: serial('id').primaryKey(),
  chargeDate: date('charge_date', { mode: 'string' }).notNull(),
  location: chargeLocation('location').notNull(),
  startPct: doublePrecision('start_pct').notNull(),
  endPct: doublePrecision('end_pct').notNull(),
  // Snapshot of settings at the time the session was recorded,
  // so later price/battery changes don't rewrite history.
  batteryKwh: doublePrecision('battery_kwh').notNull(),
  pricePerKwh: doublePrecision('price_per_kwh').notNull(),
  kwhAdded: doublePrecision('kwh_added').notNull(),
  cost: doublePrecision('cost').notNull(),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export type Settings = typeof settings.$inferSelect
export type ChargingSession = typeof chargingSessions.$inferSelect
