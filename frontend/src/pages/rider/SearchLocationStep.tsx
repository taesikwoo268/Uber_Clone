// src/pages/rider/SearchLocationStep.tsx
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, ArrowLeft, RotateCw } from "lucide-react";
import type{ Place } from "../RiderHomePage";

interface Props {
    // Nhận vị trí từ cha truyền xuống
    initialPickup: { lat: number; lng: number; name: string };
    onRefreshLocation: () => void;
    onBack: () => void;
    onConfirm: (pickup: {lat: number, lng: number, name: string}, dropoff: {lat: number, lng: number, name: string}) => void;
}

export function SearchLocationStep({ initialPickup, onRefreshLocation,onBack, onConfirm }: Props) {
    // Lưu trữ điểm đón hiện tại dựa trên props ban đầu
    const [currentPickup, setCurrentPickup] = useState(initialPickup);
    const [isEditingPickup, setIsEditingPickup] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Place[]>([]);

    // ... (Giữ nguyên phần useEffect gọi API tìm kiếm địa điểm như cũ)
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
            // Nếu đang sửa điểm đón
            setCurrentPickup({ lat: place.lat, lng: place.lng, name });
            setIsEditingPickup(false);
        } else {
            // Nếu đang sửa điểm đến -> Chuyển sang màn hình bản đồ
            onConfirm(
                currentPickup,
                { lat: place.lat, lng: place.lng, name }
            );
        }
        setSearchQuery("");
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header Điểm Đón */}
            <div className="p-4 flex items-center gap-3 border-b">
                <ArrowLeft className="w-6 h-6 cursor-pointer text-gray-600" onClick={onBack} />
                <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Điểm đón</p>
                    <div
                        className="font-semibold text-lg flex items-center gap-2 cursor-pointer"
                        onClick={() => { setIsEditingPickup(true); setSearchQuery(""); }}
                    >
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="truncate">{currentPickup.name}</span>
                    </div>
                </div>
                {/* Nút làm mới vị trí (nếu người dùng thấy sai) */}
                <button onClick={onRefreshLocation} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                    <RotateCw className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Ô nhập điểm đến / sửa điểm đón */}
            <div className="p-4">
                <div className="relative">
                    <Input
                        autoFocus
                        className="pl-10 h-12 bg-muted/50 rounded-lg text-base"
                        placeholder={isEditingPickup ? "Nhập địa chỉ đón mới..." : "Bạn muốn đi đâu?"}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-yellow-500" />
                </div>
                {isEditingPickup && (
                    <p className="text-xs text-blue-500 mt-2 cursor-pointer" onClick={() => setIsEditingPickup(false)}>
                        Hủy đổi điểm đón
                    </p>
                )}
            </div>

            {/* Danh sách gợi ý */}
            <div className="flex-1 overflow-y-auto">
                {suggestions.map((place, idx) => (
                    <div key={idx} onClick={() => handleSelectPlace(place)} className="p-4 border-b flex gap-4 hover:bg-muted/30 cursor-pointer">
                        <div>
                            <p className="font-medium">{place.name || place.displayName?.split(',')[0]}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{place.displayName}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}