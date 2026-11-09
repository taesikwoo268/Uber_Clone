// src/db/seed.ts
import { db } from './index';
import { users } from './schema';
import { sql } from 'drizzle-orm';

async function seed() {
    console.log('🌱 Bắt đầu tạo dữ liệu mẫu...');

    // 1. Dọn dẹp dữ liệu cũ (nếu có) để tránh lỗi trùng lặp email
    // Lưu ý: Chỉ dùng cách này trong môi trường dev
    await db.delete(users);
    console.log('🧹 Đã dọn dẹp bảng users cũ.');

    // 2. Băm mật khẩu chung cho tất cả tài khoản mẫu là "password123"
    const hashedPassword = await Bun.password.hash('password123');

    // 3. Chuẩn bị dữ liệu mẫu
    const seedUsers = [
        // --- 2 Hành khách (Riders) ---
        {
            email: 'rider1@example.com',
            password: hashedPassword,
            role: 'rider',
            // Không cần tọa độ cho rider
        },
        {
            email: 'rider2@example.com',
            password: hashedPassword,
            role: 'rider',
        },

        // --- 3 Tài xế (Drivers) ở các vị trí khác nhau quanh TP.HCM ---
        {
            email: 'driver1@example.com',
            password: hashedPassword,
            role: 'driver',
            isAvailable: 'online',
            // Tọa độ: Chợ Bến Thành (Quận 1)
            location: sql`ST_SetSRID(ST_MakePoint(106.6980, 10.7725), 4326)`,
        },
        {
            email: 'driver2@example.com',
            password: hashedPassword,
            role: 'driver',
            isAvailable: 'online',
            // Tọa độ: Phố đi bộ Nguyễn Huệ (Quận 1)
            location: sql`ST_SetSRID(ST_MakePoint(106.7038, 10.7743), 4326)`,
        },
        {
            email: 'driver3@example.com',
            password: hashedPassword,
            role: 'driver',
            isAvailable: 'offline', // Tài xế này đang offline
            // Tọa độ: Dinh Độc Lập (Quận 1)
            location: sql`ST_SetSRID(ST_MakePoint(106.6955, 10.7770), 4326)`,
        }
    ];

    // 4. Chèn dữ liệu vào database
    try {
        const inserted = await db.insert(users).values(seedUsers).returning({ id: users.id, email: users.email, role: users.role });
        console.log('✅ Đã chèn thành công các user sau:');
        console.table(inserted);

        console.log('\n🔑 Mật khẩu chung cho tất cả tài khoản là: password123');
        console.log('🚀 Bạn có thể dùng các email trên để test API /login');
    } catch (error) {
        console.error('❌ Lỗi khi chèn dữ liệu:', error);
    } finally {
        // Đóng kết nối để script kết thúc (nếu không Bun sẽ treo terminal)
        process.exit(0);
    }
}

seed();