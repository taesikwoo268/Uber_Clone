import {z} from "zod";

export const createRideSchema = z.object({
    pickupLat: z.number().min(-90).max(90),
    pickupLng: z.number().min(-180).max(180),
    dropoffLat: z.number().min(-90).max(90),
    dropoffLng: z.number().min(-180).max(180),
    fareCents: z.number().int().positive().optional(),
});

export const updateRideStatusSchema = z.object({
    status: z.enum(['riding', 'completed', 'cancelled']),
});