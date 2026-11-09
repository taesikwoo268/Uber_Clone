// src/pages/RiderHomePage.tsx
import { useState, useEffect } from "react";
import { SearchLocationStep } from "./rider/SearchLocationStep";
import { BookingMapStep } from "./rider/BookingMapStep";

export interface Place {
    placeId?: string;
    id?: string;
    displayName?: string;
    name?: string;
    lat: number;
    lng: number;
    distance_meters?: number;
}

export function RiderHomePage() {
    const [step, setStep] = useState<'search' | 'booking'>('search');

    // Lưu trữ tọa độ và tên hiển thị
    const [pickup, setPickup] = useState<{ lat: number; lng: number; name: string } | null>(null);
    const [dropoff, setDropoff] = useState<{ lat: number; lng: number; name: string } | null>(null);

    // Nếu chưa có điểm đón/đến mà nhảy sang booking thì quay lại
    useEffect(() => {
        if (step === 'booking' && (!pickup || !dropoff)) {
            setStep('search');
        }
    }, [step, pickup, dropoff]);

    return (
        <div className="h-screen w-full overflow-hidden bg-background">
            {step === 'search' ? (
                <SearchLocationStep
                    onConfirm={(p, d) => {
                        setPickup(p);
                        setDropoff(d);
                        setStep('booking');
                    }}
                />
            ) : (
                <BookingMapStep
                    pickup={pickup!}
                    dropoff={dropoff!}
                    onBack={() => setStep('search')}
                />
            )}
        </div>
    );
}