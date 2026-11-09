import { Elysia } from 'elysia';
import { PaymentsService } from './payments.service';
import { confirmPaymentSchema } from './payments.schema';
import {jwtPlugin} from "../../plugins/jwt";

export const paymentRoutes = new Elysia({ prefix: '/payments' })
    .use( jwtPlugin )
    .derive(async ({ jwt, headers: { authorization } }) => {
        const payload = await jwt.verify(authorization?.replace('Bearer ', ''));
        if (!payload) throw new Error('Unauthorized');
        return { user: payload as { userId: string; role: string } };
    })
    .post('/confirm', ({ body, user }) => {
        if (user.role !== 'driver') throw new Error('Chỉ tài xế xác nhận thanh toán');
        return PaymentsService.confirmPayment(user.userId, body.rideId, body.method);
    }, { body: confirmPaymentSchema });