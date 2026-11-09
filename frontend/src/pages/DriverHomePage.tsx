import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Ride {
    id: string;
    pickupLat: number;
    pickupLng: number;
    dropoffLat: number;
    dropoffLng: number;
}

export function DriverHomePage() {
    const [rides, setRides] = useState<Ride[]>([]);
    const token = localStorage.getItem('token');

    const fetchPending = async () => {
        const res = await fetch('http://localhost:3000/api/rides/pending', {
            headers: { Authorization: `${token}` },
        });
        if (res.ok) setRides(await res.json());
    };

    useEffect(() => {
        fetchPending();
        const interval = setInterval(fetchPending, 5000);
        return () => clearInterval(interval);
    }, []);

    const acceptRide = async (id: string) => {
        await fetch(`http://localhost:3000/api/rides/${id}/accept`, {
            method: 'POST',
            headers: { Authorization: `${token}` },
        });
        fetchPending();
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <Card className="mx-auto max-w-2xl">
                <CardHeader>
                    <CardTitle>Chuyến xe đang chờ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {rides.length === 0 && <p className="text-muted-foreground">Chưa có chuyến nào.</p>}
                    {rides.map((ride) => (
                        <div key={ride.id} className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                                <p className="text-sm font-medium">Điểm đón: {ride.pickupLat.toFixed(4)}, {ride.pickupLng.toFixed(4)}</p>
                                <p className="text-xs text-muted-foreground">Điểm đến: {ride.dropoffLat.toFixed(4)}, {ride.dropoffLng.toFixed(4)}</p>
                            </div>
                            <Button size="sm" onClick={() => acceptRide(ride.id)}>Nhận</Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}