import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

async function main() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);
    try {
        console.log('⏳ Đang chạy migration...');
        await migrate(db, { migrationsFolder: './drizzle' });
        console.log('✅ Migration thành công!');
    } catch (e) {
        console.error('❌ Migration thất bại:', e);
    } finally {
        await pool.end();
    }
}

main();