import {Elysia} from "elysia";
import {jwtPlugin} from "../../plugins/jwt";
import {BookingsService} from "./bookings.service";
import {createBookingSchema, estimateFareSchema} from "./bookings.schema";


export const bookingsRoutes = new Elysia({prefix: '/bookings'})
    .use( jwtPlugin)
    .derive(async ({ jwt, headers: { authorization }}) => {
        if (!authorization) throw new Error('Unauthorized');
        // Phải cắt bỏ chữ 'Bearer ' (nếu có)
        const token = authorization.replace('Bearer ', '').trim();

        const payload = await jwt.verify(token);
        if (!payload) throw new Error('Unauthorized');

        return { user: payload as { userId: string; role: string } };
    })
    .post('/estimate', ({ body }) => BookingsService.estimateFare(body), {
        body: estimateFareSchema,
    })
    .post('/', ({ body , user}) => {
        if (user.role !== 'rider') throw new Error('Chỉ rider mới được đặt');
        return BookingsService.createBooking(user.userId, body);
    }, {body: createBookingSchema})