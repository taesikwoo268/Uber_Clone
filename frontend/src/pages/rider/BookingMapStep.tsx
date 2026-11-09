// src/pages/rider/BookingMapStep.tsx
import { useState, useEffect } from "react";
import { RideMap } from "@/components/RideMap"; // Component Map của bạn
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Users } from "lucide-react";

interface Props {
    pickup: { lat: number; lng: number; name: string };
    dropoff: { lat: number; lng: number; name: string };
    onBack: () => void;
}

// Mock data các loại xe
const VEHICLES = [
    { id: 'bike', name: 'Uber Bike', price: 25000, time: '3 phút', icon: '🛵' },
    { id: 'car4', name: 'Uber Car 4 chỗ', price: 97000, time: '5 phút', icon: '🚗' },
    { id: 'car7', name: 'Uber Car 7 chỗ', price: 122000, time: '7 phút', icon: '🚙' },
];

export function BookingMapStep({ pickup, dropoff, onBack }: Props) {
    const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[1]);
    const [estimate, setEstimate] = useState<any>(null);

    // Gọi API lấy giá thực tế từ backend
    useEffect(() => {
        const fetchEstimate = async () => {
            const token = localStorage.getItem('token');
            const payload = {
                pickupLat: pickup.lat, pickupLng: pickup.lng,
                dropoffLat: dropoff.lat, dropoffLng: dropoff.lng,
            };
            console.log('Dữ liệu gửi đi ước tính:', payload);

            try {
                const res = await fetch('http://localhost:3000/api/bookings/estimate', {
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
        const res = await fetch('http://localhost:3000/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                pickupLat: pickup.lat, pickupLng: pickup.lng,
                dropoffLat: dropoff.lat, dropoffLng: dropoff.lng,
                vehicleType: selectedVehicle.id,
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
                <RideMap pickup={[pickup.lat, pickup.lng]} dropoff={[dropoff.lat, dropoff.lng]} />
            </div>

            {/* 2. THANH ĐỊA CHỈ NỔI (Góc trên) */}
            <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
                <Button variant="secondary" size="icon" className="shrink-0 rounded-full shadow-md" onClick={onBack}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-md flex-1 flex items-center gap-3 px-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                    <p className="text-sm font-medium truncate flex-1">{pickup.name.split(',')[0]}</p>
                    <div className="w-px h-4 bg-gray-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                    <p className="text-sm font-medium truncate flex-1">{dropoff.name.split(',')[0]}</p>
                </div>
            </div>

            {/* 3. BẢNG CHỌN XE (Dưới cùng) */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 pb-6">

                {/* Danh sách xe */}
                <div className="space-y-3 mb-4">
                    {VEHICLES.map((v) => (
                        <div
                            key={v.id}
                            onClick={() => setSelectedVehicle(v)}
                            className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer ${
                                selectedVehicle.id === v.id ? 'border-green-500 bg-green-50/50' : 'border-transparent hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-3xl">{v.icon}</span>
                                <div>
                                    <p className="font-bold text-base">{v.name}</p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> 4</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Đón trong {v.time}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg text-green-600">
                                    {v.id === 'car4' && estimate ? estimate.fareCents.toLocaleString('vi-VN') : v.price.toLocaleString('vi-VN')} đ
                                </p>
                                <p className="text-xs text-muted-foreground line-through">{(v.price * 1.2).toLocaleString('vi-VN')} đ</p>
                            </div>
                        </div>
                    ))}
                </div>

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