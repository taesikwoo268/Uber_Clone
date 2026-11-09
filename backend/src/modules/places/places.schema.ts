import { z } from "zod";

export const searchPlacesSchema = z.object({
    q: z.string().min(1,'Vui long nhap tu khoa tim kiem'),
    limit: z.coerce.number().min(1).max(10).optional().default(5),
})

export const nearbyPlacesSchema = z.object({
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
    radius: z.coerce.number().positive().optional().default(1000),
});