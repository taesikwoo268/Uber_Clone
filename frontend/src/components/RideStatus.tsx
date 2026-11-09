import { useRideSocket } from '../hooks/useRideSocket';

export function RideStatus() {
    // Lấy token từ localStorage (lưu ý: trong thực tế nên dùng Context hoặc Zustand)
    const token = localStorage.getItem('token');

    useRideSocket(token, (data) => {
        if (data.type === 'ride_accepted') {
            alert(`Tài xế đã nhận chuyến! Mã chuyến: ${data.rideId}`);
        }
    });

    return (
        <div className="p-4 bg-blue-100 text-blue-800 rounded-lg shadow">
            Đang theo dõi trạng thái chuyến đi...
        </div>
    );
}