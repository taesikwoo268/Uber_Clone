import {useEffect, useRef} from "react";

export function useRideSocket(token: string | null, onMessage: (data: any) => void) {
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!token || token === 'null' || token === 'undefined') return;

        const ws = new WebSocket(`ws://localhost:3000/ws?token=$(token}`);

        ws.onopen = () => console.log('WS connected');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessage(data);
        };
        ws.onerror = (err) => console.log('WS error:',err);
        ws.onclose = () => console.log('WS closed');

        wsRef.current = ws;

        return () => {
            ws.close();
        };
    }, [token]);

    return wsRef;
}