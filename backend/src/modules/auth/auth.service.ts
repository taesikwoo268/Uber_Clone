import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';

export class AuthService {
    static async register(data: { email: string; password: string; role: string }) {
        const hashedPassword = await Bun.password.hash(data.password);
        const [newUser] = await db.insert(users)
            .values({ ...data, password: hashedPassword })
            .returning();
        return newUser;
    }

    static async validateUser(email: string, pass: string) {
        const user = await db.query.users.findFirst({ where: eq(users.email, email) });
        if (!user) return null;
        const isValid = await Bun.password.verify(pass, user.password);
        return isValid ? user : null;
    }
}