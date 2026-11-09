import { Elysia } from 'elysia';
import { RiderService } from './rides.service';
import { createRideSchema, updateRideStatusSchema } from './rides.schema';
import {jwtPlugin} from "../../plugins/jwt";

export const rideRoutes = new Elysia({ prefix: '/rides' })
    .use( jwtPlugin )
    .derive(async ({ jwt, headers: { authorization } }) => {
        const payload = await jwt.verify(authorization);
        if (!payload) throw new Error('Unauthorized');
        return { user: payload as { userId: string; role: string } };
    })

    .post('/', async ({ body, user }) => {
        if (user.role !== 'rider') throw new Error('Chỉ hành khách mới có thể đặt xe');
        return RiderService.createRide(user.userId, body);
    }, { body: createRideSchema })

    .get('/pending', async ({ user }) => {
        if (user.role !== 'driver') throw new Error('Chỉ tài xế mới có thể xem chuyến chờ');
        return RiderService.getPendingRides();
    })

    .post('/:id/accept', async ({ params, user }) => {
        if (user.role !== 'driver') throw new Error('Forbidden');
        return RiderService.acceptRide(params.id, user.userId);
    })

    .patch('/:id/status', async ({ params, body, user }) => {
        return RiderService.updateStatus(params.id, user.userId, user.role, body.status);
    }, { body: updateRideStatusSchema });