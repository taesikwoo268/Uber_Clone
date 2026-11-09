import {db} from '../../db';
import {rides} from "../../db/schema";
import {eq} from "drizzle-orm";
import {notifyUser} from "../../ws/ride-socket";

export class PaymentsService {
    static async confirmPayment(driverID: string, rideId: string, method: string ) {
        const ride = await db.query.rides.findFirst({
            where: eq(rides.id, rideId)
        });
        if(!ride) throw new Error('Khong tim thay chuyen');
        if (ride.driverId !== driverID) throw new Error('Fobidden');
        if (ride.status !== 'complete' ) throw new Error('Chuyen chua hoan thanh');

        const [updated] = await db.update(rides)
            .set({paymentStatus: 'paid', paymentMethod: method, updatedAt: new Date()})
            .where(eq(rides.id, rideId))
            .returning();

        notifyUser(updated.riderId, {
            type: 'payment_confirmed',
            rideId,
            amount: updated.fareCents,
            message: 'Thanh toan thanh cong',
        });
        return updated;
    }
}