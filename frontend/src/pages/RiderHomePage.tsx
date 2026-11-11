// src/pages/RiderHomePage.tsx
import { useState, useEffect } from "react";
import { SearchLocationStep } from "./rider/SearchLocationStep";
import { BookingMapStep } from "./rider/BookingMapStep";
import { MapPin } from "lucide-react";

export interface Place {
    lat: number;
    lng: number;
    name: string;
    displayName?: string; // Cho phép optional để dễ dùng
}

export function RiderHomePage() {
    const [step, setStep] = useState<'home' | 'search' | 'booking'>('home');
    const [pickup, setPickup] = useState<Place | null>(null);
    const [dropoff, setDropoff] = useState<Place | null>(null);

    const fetchLocation = () => {
        if (!navigator.geolocation) {
            const fallback = { lat: 21.0287, lng: 105.8523, name: "Hồ Hoàn Kiếm, Hà Nội" };
            setPickup(fallback);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const loc: Place = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    name: "Vị trí hiện tại của bạn",
                    displayName: "Vị trí hiện tại của bạn"
                };
                setPickup(loc);
                localStorage.setItem('rider_current_location', JSON.stringify(loc));

                const token = localStorage.getItem('token');
                await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/users/location`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ lat: loc.lat, lng: loc.lng }),
                }).catch(err => console.error(err));
            },
            (err) => {
                console.error(err);
                const fallback: Place = { lat: 21.0287, lng: 105.8523, name: "Hồ Hoàn Kiếm, Hà Nội" };
                setPickup(fallback);
                localStorage.setItem('rider_current_location', JSON.stringify(fallback));
            },
            { enableHighAccuracy: true }
        );
    };

    useEffect(() => {
        const savedLocation = localStorage.getItem('rider_current_location');
        if (savedLocation) {
            setPickup(JSON.parse(savedLocation));
        } else {
            fetchLocation();
        }
    }, []);

    const handleRefreshLocation = () => {
        localStorage.removeItem('rider_current_location');
        fetchLocation();
    };

    if (step === 'home') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center p-6">
                <div className="max-w-md w-full mx-auto space-y-8">
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Uber Clone</h1>
                        <p className="text-gray-500">Di chuyển an toàn, nhanh chóng</p>
                    </div>
                    <div
                        onClick={() => setStep('search')}
                        className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-xl transition-shadow"
                    >
                        <div className="bg-yellow-100 p-2 rounded-full">
                            <MapPin className="w-6 h-6 text-yellow-600" />
                        </div>
                        <span className="text-lg text-gray-400 font-medium">Bạn muốn đi đâu?</span>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'search') {
        return (
            <SearchLocationStep
                initialPickup={pickup || { lat: 21.0287, lng: 105.8523, name: "Hà Nội" }}
                onRefreshLocation={handleRefreshLocation} // Truyền hàm này xuống
                onBack={() => setStep('home')}
                onConfirm={(p, d) => {
                    setPickup(p);
                    setDropoff(d);
                    setStep('booking');
                }}
            />
        );
    }

    if (step === 'booking' && pickup && dropoff) {
        return (
            <BookingMapStep
                pickup={pickup}
                dropoff={dropoff}
                onBack={() => setStep('search')}
            />
        );
    }

    return null;
}