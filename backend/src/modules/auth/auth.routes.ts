import { Elysia } from 'elysia';
import { jwtPlugin } from '../../plugins/jwt'; // <-- import plugin đã cấu hình
import { registerSchema, loginSchema } from './auth.schema';
import { AuthService } from './auth.service';

export const authRoutes = new Elysia({ prefix: '/auth' })
    .use(jwtPlugin)
    .post('/register', async ({ body }) => {
        return AuthService.register(body);
    }, { body: registerSchema })

    .post('/login', async ({ body, jwt }) => { // bây giờ TypeScript mới thấy jwt
        const user = await AuthService.validateUser(body.email, body.password);
        if (!user) throw new Error('Email hoặc mật khẩu không đúng');

        const token = await jwt.sign({ userId: user.id, role: user.role });
        return { token };
    }, { body: loginSchema })

    .get('/profile', async ({ jwt, headers: { authorization } }) => {
        const payload = await jwt.verify(authorization);
        if (!payload) throw new Error('Unauthorized');
        return { message: 'Welcome', user: payload };
    });