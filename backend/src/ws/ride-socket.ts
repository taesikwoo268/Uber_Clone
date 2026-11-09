import { Elysia } from 'elysia';

// Lưu trữ kết nối: userId -> WebSocket
export const connections = new Map<string, any>();

export const rideSocket = new Elysia()
    .ws('/ws', {
        open(ws) {
            // Lấy userId từ query (đã được verify JWT ở client)
            const url = new URL(ws.data.request.url);
            const userId = url.searchParams.get('userId');
            if (userId) connections.set(userId, ws);
        },
        close(ws) {
            for (const [key, val] of connections.entries()) {
                if (val === ws) connections.delete(key);
            }
        }
    });

// Hàm tiện ích để các service khác gọi tới
export function notifyUser(userId: string, payload: any) {
    const ws = connections.get(userId);
    if (ws) ws.send(JSON.stringify(payload));
}