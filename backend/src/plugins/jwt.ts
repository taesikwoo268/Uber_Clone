import Elysia from 'elysia';
import {jwt} from "@elysiajs/jwt";

export const jwtPlugin = new Elysia({ name: 'jwt-plugin'})
    .use(jwt(
        {
            name: 'jwt',
            secret: process.env.JWT_SECRET!,
        }
    ));