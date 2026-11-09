import { z } from 'zod';

export const nearbyDriversSchema = z.object({
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
    radius: z.coerce.number().positive().optional().default(3000), // mét
});

export const driverStatusSchema = z.object({
    lat: z.number().optional(),
    lng: z.number().optional(),
    isAvailable: z.enum(['online', 'offline']),
});