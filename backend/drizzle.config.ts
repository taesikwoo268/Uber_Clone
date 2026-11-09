import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'postgresql',
    schema: './src/db/schema.ts', // Đường dẫn tới file schema
    out: './drizzle',             // Thư mục chứa migration (nếu cần)
    dbCredentials: {
        url: process.env.DATABASE_URL!, // Lấy từ biến môi trường
    },
    extensionsFilters: ['postgis'],
});