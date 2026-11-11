// src/pages/rider/BookingMapStep.tsx
import { useState, useEffect } from "react";
import { RideMap } from "@/components/RideMap"; // Component Map của bạn
import { Button } from "@/components/ui/button";
import { ArrowLeft} from "lucide-react";
import polyline from '@mapbox/polyline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Props {
    pickup: { lat: number; lng: number; name: string };
    dropoff: { lat: number; lng: number; name: string };
    onBack: () => void;
}


export function BookingMapStep({ pickup, dropoff, onBack }: Props) {
    const [estimate, setEstimate] = useState<any>(null);
    const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

    // Gọi API lấy giá thực tế từ backend
    useEffect(() => {
        const fetchRoute = async () => {
            try {
                const res = await fetch(
                    API_URL+`/api/places/route?pickupLat=${pickup.lat}&pickupLng=${pickup.lng}&dropoffLat=${dropoff.lat}&dropoffLng=${dropoff.lng}`
                );
                if (res.ok) {
                    const data = await res.json();
                    // Giải mã polyline thành mảng [lat, lng]
                    const decoded = polyline.decode(data.geometry);
                    // polyline.decode trả về [lat, lng] nhưng đôi khi cần đảo ngược, kiểm tra kỹ
                    setRouteCoords(decoded as [number, number][]);
                }
            } catch (err) {
                console.error('Lỗi lấy tuyến đường:', err);
            }
        };
        fetchRoute();
        const fetchEstimate = async () => {
            const token = localStorage.getItem('token');
            const payload = {
                pickupLat: pickup.lat, pickupLng: pickup.lng,
                dropoffLat: dropoff.lat, dropoffLng: dropoff.lng,
            };
            console.log('Dữ liệu gửi đi ước tính:', payload);
            console.log('gia tien uoc tinh: ', estimate);

            try {
                const res = await fetch(API_URL+ '/api/bookings/estimate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(payload),
                });

                if (res.ok) {
                    setEstimate(await res.json());
                } else {
                    // In lỗi ra nếu Backend trả về 500
                    const errData = await res.text();
                    console.error('Lỗi từ Backend:', errData);
                }
            } catch (err) {
                console.error('Lỗi fetch:', err);
            }
        };
        fetchEstimate();
    }, [pickup, dropoff]);

    const handleBook = async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(API_URL+'/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                pickupLat: pickup.lat, pickupLng: pickup.lng,
                dropoffLat: dropoff.lat, dropoffLng: dropoff.lng,
                paymentMethod: 'cash',
            }),
        });
        if (res.ok) {
            alert('Đặt xe thành công! Đang tìm tài xế...');
        }
    };

    return (
        <div className="relative h-full w-full">
            {/* 1. BẢN ĐỒ (Chiếm toàn bộ không gian) */}
            <div className="absolute inset-0 z-0">
                <RideMap pickup={[pickup.lat, pickup.lng]} dropoff={[dropoff.lat, dropoff.lng]} routeCoords={routeCoords}  />
            </div>

            {/* 2. THANH ĐỊA CHỈ NỔI (Góc trên) */}
            <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
                <Button variant="secondary" size="icon" className="shrink-0 rounded-full shadow-md" onClick={onBack}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
            </div>

            {/* 3. BẢNG CHỌN XE (Dưới cùng) */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 pb-6">

                {/* Thanh phương thức thanh toán */}
                <div className="flex items-center gap-4 p-3 bg-gray-100 rounded-xl mb-4">
                    <span className="text-sm font-medium">💵 Tiền mặt</span>
                    <span className="text-sm font-medium text-muted-foreground ml-auto">Thay đổi</span>
                </div>

                {/* Nút Đặt xe */}
                <Button onClick={handleBook} className="w-full h-14 text-lg font-bold bg-green-500 hover:bg-green-600 rounded-xl">
                    Đặt xe
                </Button>
            </div>
        </div>
    );
}