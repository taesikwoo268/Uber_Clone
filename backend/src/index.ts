import { Elysia } from 'elysia';
import { jwtPlugin } from './plugins/jwt';
import { errorPlugin } from './plugins/error';

// Import các modules
import { authRoutes } from './modules/auth/auth.routes';
import { rideRoutes } from './modules/rides/rides.routes';
import { driverRoutes } from './modules/drivers/drivers.routes';
import { bookingsRoutes } from './modules/bookings/bookings.routes';
import { paymentRoutes} from "./modules/payments/payments.routes";
import { rideSocket } from './ws/ride-socket';
import { cors } from '@elysiajs/cors';
import { placesRoutes } from "./modules/places/places.routes";
import { userRoutes } from "./modules/users/users.routes";

const app = new Elysia()
    .use(cors({
        origin: [
            'http://localhost:5173',
            'https://uber-clone-1-876v.onrender.com'
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    }))
    .use(errorPlugin)
    .use(jwtPlugin)
    // Gắn các routes
    .group('/api', (app) =>
        app
            .use(authRoutes)
            .use(rideRoutes)
            .use(driverRoutes)
            .use(bookingsRoutes)
            .use(paymentRoutes)
            .use(placesRoutes)
            .use(userRoutes)
    )
    // WebSocket nằm ngoài prefix /api
    .use(rideSocket)
    .get('/', () => 'Uber Clone API is running!')
    .listen(3000);

console.log(`🦊 Server running at http://localhost:3000`);