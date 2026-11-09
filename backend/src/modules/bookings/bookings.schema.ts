import {z} from "zod";

export const estimateFareSchema = z.object({
    pickupLat: z.number().min(-90).max(90),
    pickupLng: z.number().min(-180).max(180),
    dropoffLat: z.number().min(-90).max(90),
    dropoffLng: z.number().min(-180).max(180),
});

export const createBookingSchema = z.object({
    paymentMethod: z.enum(['cash', 'card']).default('cash'),
});