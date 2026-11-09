import { Elysia, t } from 'elysia';
import { UsersService } from './users.service';
import {jwtPlugin} from "../../plugins/jwt";

export const userRoutes = new Elysia({ prefix: '/users' })
    .use( jwtPlugin)
    .derive(async ({ jwt, headers: { authorization } }) => {
        const payload = await jwt.verify(authorization?.replace('Bearer ', ''));
        if (!payload) throw new Error('Unauthorized');
        return { user: payload as { userId: string; role: string } };
    })

    // API cập nhật vị trí hiện tại
    .post('/location', async ({ body, user }) => {
        return UsersService.updateLocation(user.userId, body.lat, body.lng);
    }, {
        body: t.Object({
            lat: t.Number(),
            lng: t.Number(),
        })
    });