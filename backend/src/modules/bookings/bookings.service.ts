import { db } from '../../db';
import { rides } from '../../db/schema';

const BASE_FARE_CENTS = 10000;       // 10.000đ giá mở cửa
const PER_KM_CENTS = 12000;          // 12.000đ/km
const PER_MINUTE_CENTS = 300;        // 300đ/phút (tạm tính)

// Công thức Haversine tính khoảng cách (mét)
function haversine(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371000;
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export class BookingsService {
    static estimateFare(data: any) {
        const distanceMeters = haversine(
            data.pickupLat, data.pickupLng, data.dropoffLat, data.dropoffLng
        );
        const distanceKm = distanceMeters / 1000;
        // Giả sử tốc độ 30km/h => thời gian = distanceKm / 30 * 60 phút
        const estimatedMinutes = (distanceKm / 30) * 60;

        const fareCents = Math.round(
            BASE_FARE_CENTS + distanceKm * PER_KM_CENTS + estimatedMinutes * PER_MINUTE_CENTS
        );
        return { distanceKm: Number(distanceKm.toFixed(2)), fareCents };
    }

    static async createBooking(riderId: string, data: any) {
        const { fareCents } = this.estimateFare(data);
        const [ride] = await db.insert(rides).values({
            riderId,
            pickupLat: data.pickupLat,
            pickupLng: data.pickupLng,
            dropoffLat: data.dropoffLat,
            dropoffLng: data.dropoffLng,
            fareCents,
            status: 'pending',
            paymentMethod: data.paymentMethod,
            paymentStatus: 'unpaid',
        }).returning();
        return ride;
    }
}