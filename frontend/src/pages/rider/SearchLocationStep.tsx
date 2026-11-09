
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, Heart, ArrowLeft } from "lucide-react";
import type {Place} from "../RiderHomePage";

interface Props {
    onConfirm: (pickup: {lat: number, lng: number, name: string}, dropoff: {lat: number, lng: number, name: string}) => void;
}

export function SearchLocationStep({ onConfirm }: Props) {
    const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
    const [pickupName, setPickupName] = useState("Đang lấy vị trí...");
    const [dropoffName, setDropoffName] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Place[]>([]);
    const [isEditingPickup, setIsEditingPickup] = useState(false);

    // Lấy vị trí hiện tại
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setPickupName("Sử dụng vị trí hiện tại");
            },
            () => setPickupName("Không thể lấy vị trí")
        );
    }, []);

    // Gọi API tìm kiếm (giống phần trước)
    useEffect(() => {
        if (!searchQuery.trim()) { setSuggestions([]); return; }
        const timer = setTimeout(async () => {
            const res = await fetch(`http://localhost:3000/api/places/search?q=${encodeURIComponent(searchQuery)}&limit=8`);
            if (res.ok) setSuggestions(await res.json());
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSelectPlace = (place: Place) => {
        const name = place.displayName || place.name || 'Địa điểm';
        if (isEditingPickup) {
            setPickupName(name);
            setCurrentLocation({ lat: place.lat, lng: place.lng }); // Cập nhật lại điểm đón
            setIsEditingPickup(false);
        } else {
            setDropoffName(name);
            // Chuyển sang giai đoạn 2
            onConfirm(
                { lat: currentLocation!.lat, lng: currentLocation!.lng, name: pickupName },
                { lat: place.lat, lng: place.lng, name: name }
            );
        }
        setSearchQuery("");
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-4 flex items-center gap-3 border-b">
                <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={() => window.history.back()} />
                <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Điểm đón</p>
                    <div
                        className="font-semibold text-lg flex items-center gap-2 cursor-pointer"
                        onClick={() => { setIsEditingPickup(true); setSearchQuery(""); }}
                    >
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        {pickupName}
                    </div>
                </div>
            </div>

            {/* Ô nhập điểm đến */}
            <div className="p-4">
                <div className="relative">
                    <Input
                        autoFocus
                        className="pl-10 h-12 bg-muted/50 rounded-lg text-base"
                        placeholder="Bạn muốn đi đâu?"
                        value={isEditingPickup ? searchQuery : searchQuery} // Logic hiển thị
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-yellow-500" />
                </div>
                {isEditingPickup && <p className="text-xs text-blue-500 mt-2 cursor-pointer" onClick={() => setIsEditingPickup(false)}>Hủy đổi điểm đón</p>}
            </div>

            {/* Danh sách gợi ý */}
            <div className="flex-1 overflow-y-auto">
                {suggestions.length > 0 ? (
                    suggestions.map((place, idx) => (
                        <div key={idx} onClick={() => handleSelectPlace(place)} className="p-4 border-b flex gap-4 hover:bg-muted/30 cursor-pointer">
                            <Clock className="w-5 h-5 text-muted-foreground mt-1" />
                            <div>
                                <p className="font-medium">{place.name || place.displayName?.split(',')[0]}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">{place.displayName}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    // Gợi ý mặc định khi chưa gõ (Giống ảnh 1)
                    <div className="p-4 space-y-4">
                        <div className="flex items-center gap-4 p-2 cursor-pointer">
                            <Heart className="w-5 h-5 text-red-500" />
                            <span className="font-medium">Địa chỉ đã lưu</span>
                        </div>
                        <div className="flex items-center gap-4 p-2 cursor-pointer">
                            <MapPin className="w-5 h-5 text-muted-foreground" />
                            <span className="font-medium">Tìm trên bản đồ</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}