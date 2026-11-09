import { Elysia } from 'elysia';
import { DriversService } from './drivers.service';
import { nearbyDriversSchema, driverStatusSchema } from './drivers.schema';
import {jwtPlugin} from "../../plugins/jwt";

export const driverRoutes = new Elysia({ prefix: '/drivers' })
    .use( jwtPlugin )
    .derive(async ({ jwt, headers: { authorization } }) => {
        const payload = await jwt.verify(authorization);
        if (!payload) throw new Error('Unauthorized');
        return { user: payload as { userId: string; role: string } };
    })

    .get('/nearby', async ({ query }) => {
        const { lat, lng, radius } = query;
        return DriversService.findNearby(lat, lng, radius);
    }, { query: nearbyDriversSchema })

    .post('/status', async ({ body, user }) => {
        if (user.role !== 'driver') throw new Error('Chỉ tài xế mới được cập nhật trạng thái');
        return DriversService.updateStatus(user.userId, body);
    }, { body: driverStatusSchema });