import { z } from "zod";

export const confirmPaymentSchema = z.object({
    rideId: z.string().uuid(),
    method: z.enum(['cash','card']),
});