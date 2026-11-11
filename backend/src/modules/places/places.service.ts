import { db } from '../../db';
import {sql} from "drizzle-orm";
import {users} from "../../db/schema";

export class PlacesService {
    static async search(query: string, limit: number) {
        const url = new URL('https://nominatim.openstreetmap.org/search');
        url.searchParams.append('q', query);
        url.searchParams.append('format', 'jsonv2');
        url.searchParams.append('limit', limit.toString());
        url.searchParams.append('accept-language', 'vi'); // Ưu tiên tiếng Việt
        url.searchParams.append('countrycodes', 'vn'); // Giới hạn ở Việt Nam

        const response = await fetch(url.toString(),{
            headers: {
                'User-Agent': 'UberCloneApp/1.0 kd2682006@gmail.com',
            },
        });

        if(!response.ok) {
            throw new Error('Không thể tìm kiếm địa điểm lúc này');
        }

        const data = await response.json();

        return data.map((item: any) => ({
            placeId: item.place_id,
            displayName: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
        }));
    }

    static async findNearbyPickupPoints(lat: number, lng: number, radius: number) {
        const userPoint = sql`ST_SetSRID(ST_MakePoint(${lat},${lng}), 4326)`;

        const result = await db.execute(sql`
            SELECT id, name,
                ST_X(location::geometry) AS lng,
                ST_Y(location::geometry) AS lat,
                ST_Distance(location, ${userPoint}, ${radius})) AS distance_meters, 
            FROM pickup_points
            WHERE ST_Within(location, ${userPoint}, ${radius})
            ORDER BY distance_meters
            LIMIT 10
            `);
        return result.rows;
    }
    static async getRoute(pickupLat: number, pickupLng: number, dropoffLat: number, dropoffLng: number) {
        // OSRM yêu cầu tọa độ dạng: lng,lat;lng,lat
        const url = `https://router.project-osrm.org/route/v1/driving/${pickupLng},${pickupLat};${dropoffLng},${dropoffLat}?overview=full&geometries=polyline`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Không thể lấy tuyến đường');

        const data = await response.json();
        if (!data.routes || data.routes.length === 0) throw new Error('Không tìm thấy tuyến đường');

        // Trả về chuỗi polyline đã mã hóa (để Frontend giải mã)
        return {
            geometry: data.routes[0].geometry,
            distance: data.routes[0].distance, // mét
            duration: data.routes[0].duration, // giây
        };
    }
}