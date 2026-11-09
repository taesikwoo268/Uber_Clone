import { db } from '../../db';
import { rides } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { notifyUser } from '../../ws/ride-socket';

export class RiderService {
    // 1. Tạo chuyến đi mới (Rider)
    static async createRide(riderId: string, data: any) {
        const [ride] = await db.insert(rides).values({
            ...data,
            riderId,
            status: 'pending',
        }).returning();
        return ride;
    }

    // 2. Lấy danh sách chuyến đang chờ (Driver)
    static async getPendingRides() {
        return db.query.rides.findMany({
            where: eq(rides.status, 'pending'),
        });
    }

    // 3. Tài xế nhận chuyến
    static async acceptRide(rideId: string, driverId: string) {
        const [updated] = await db.update(rides)
            .set({ driverId, status: 'accepted', updatedAt: new Date() })
            .where(and(eq(rides.id, rideId), eq(rides.status, 'pending')))
            .returning();

        if (!updated) throw new Error('Chuyến đi không tồn tại hoặc đã có người nhận');

        // Thông báo cho Rider qua WebSocket
        notifyUser(updated.riderId, {
            type: 'ride_accepted',
            rideId: updated.id,
            driverId,
            message: 'Tài xế đã nhận chuyến của bạn!',
        });

        return updated;
    }

    // 4. Cập nhật trạng thái chuyến (Tài xế đã đến, hoàn thành, hủy)
    static async updateStatus(rideId: string, userId: string, role: string, status: string) {
        // Kiểm tra quyền: chỉ rider hoặc driver của chuyến đó mới được cập nhật
        const ride = await db.query.rides.findFirst({ where: eq(rides.id, rideId) });
        if (!ride) throw new Error('Không tìm thấy chuyến đi');
        if (role === 'rider' && ride.riderId !== userId) throw new Error('Forbidden');
        if (role === 'driver' && ride.driverId !== userId) throw new Error('Forbidden');

        const [updated] = await db.update(rides)
            .set({ status, updatedAt: new Date() })
            .where(eq(rides.id, rideId))
            .returning();

        // Thông báo cho bên còn lại
        const targetId = role === 'rider' ? updated.driverId : updated.riderId;
        if (targetId) {
            notifyUser(targetId, {
                type: 'ride_status_updated',
                rideId: updated.id,
                status,
            });
        }
        return updated;
    }
}