import { db } from '../../db';
import { users } from '../../db/schema';
import { eq, sql } from 'drizzle-orm';

export class DriversService {
    // Cập nhật trạng thái và vị trí của tài xế
    static async updateStatus(driverId: string, data: any) {
        const updateData: any = { isAvailable: data.isAvailable };

        // Nếu có tọa độ mới, cập nhật cột geometry
        if (data.lat !== undefined && data.lng !== undefined) {
            updateData.location = sql`ST_SetSRID(ST_MakePoint(${data.lng}, ${data.lat}), 4326)`;
        }

        await db.update(users).set(updateData).where(eq(users.id, driverId));
        return { success: true };
    }

    // Tìm tài xế gần đây (dùng PostGIS ST_DWithin)
    static async findNearby(lat: number, lng: number, radius: number) {
        const passengerPoint = sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)`;

        const result = await db.execute(sql`
      SELECT id, email, 
             ST_X(location::geometry) AS lng, 
             ST_Y(location::geometry) AS lat,
             ST_Distance(location, ${passengerPoint}) AS distance_meters
      FROM users
      WHERE role = 'driver' 
        AND is_available = 'online' 
        AND location IS NOT NULL
        AND ST_DWithin(location, ${passengerPoint}, ${radius})
      ORDER BY distance_meters
      LIMIT 10
    `);

        return result.rows;
    }
}