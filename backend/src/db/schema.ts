import { pgTable, uuid, varchar, timestamp , doublePrecision, integer } from 'drizzle-orm/pg-core';
import {geometry} from "drizzle-orm/pg-core/columns/postgis_extension/geometry";

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    role: varchar('role', { length: 50 }).notNull().default('rider'), // 'rider' | 'driver'
    createdAt: timestamp('created_at').defaultNow().notNull(),
    isAvailable: varchar('is_available', { length: 10 }).default('offline'),
    location: geometry('location', { type: 'point', mode: 'xy', srid: 4326}),
});

export const rides = pgTable('rides', {
    id: uuid('id').defaultRandom().primaryKey(),
    riderId: uuid('rider_id').notNull().references(() => users.id),
    driverId: uuid('driver_id').references(() => users.id), // Ban đầu có thể để trống
    pickupLat: doublePrecision('pickup_lat').notNull(),
    pickupLng: doublePrecision('pickup_lng').notNull(),
    dropoffLat: doublePrecision('dropoff_lat').notNull(),
    dropoffLng: doublePrecision('dropoff_lng').notNull(),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    // pending | accepted | riding | completed | cancelled
    fareCents: integer('fare_cents'), // Đơn vị: cent
    paymentMethod: varchar('paymentMethod',{length: 20}).default('cash'),
    paymentStatus: varchar('paymentStatus', {length: 20}).default('unpaid'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const pickup_ponints = pgTable( 'pickup_points', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', {length: 255}).notNull(),
    location: geometry('location',  { type: 'point', mode: 'xy', srid: 4326}),
})