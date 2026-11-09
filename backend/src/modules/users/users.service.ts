import { db } from "../../db";
import {users} from "../../db/schema";
import {eq, sql} from "drizzle-orm";

export class UsersService {
    static async updateLocation( userID: string, lat: number, lng: number) {
        await db.update(users)
            .set({
                location: sql`ST_SetSRID(ST_MakePoint(${lng}, ${lat}),4326)`
            })
            .where(eq(users.id, userID))
        return {success: true};
    }
}