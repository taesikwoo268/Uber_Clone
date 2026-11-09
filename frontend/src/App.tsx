// src/App.tsx
import { useState, useEffect } from 'react';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { RiderHomePage } from '@/pages/RiderHomePage';
import { DriverHomePage } from '@/pages/DriverHomePage';

type AuthState = 'login' | 'register' | 'authenticated';

function App() {
    const [authState, setAuthState] = useState<AuthState>('login');
    const [role, setRole] = useState<string>('rider');

    // Kiểm tra token khi tải trang
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Giải mã JWT để lấy role
                const payload = JSON.parse(atob(token.split('.')[1]));
                setRole(payload.role);
                setAuthState('authenticated');
            } catch {
                // Token hỏng, xóa đi
                localStorage.removeItem('token');
                setAuthState('login');
            }
        }
    }, []);

    const handleLoginSuccess = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setRole(payload.role);
        }
        setAuthState('authenticated');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setAuthState('login');
    };

    return (
        <div>
            {authState === 'login' && (
                <LoginPage
                    onLogin={handleLoginSuccess}
                    onSwitchToRegister={() => setAuthState('register')}
                />
            )}

            {authState === 'register' && (
                <RegisterPage
                    onRegisterSuccess={() => setAuthState('login')}
                    onSwitchToLogin={() => setAuthState('login')}
                />
            )}

            {authState === 'authenticated' && (
                <div>
                    {/* Nút đăng xuất nhỏ ở góc trên (tùy chọn) */}
                    <div className="absolute top-4 right-4 z-50">
                        <button
                            onClick={handleLogout}
                            className="text-sm text-muted-foreground hover:text-foreground underline"
                        >
                            Đăng xuất
                        </button>
                    </div>

                    {role === 'driver' ? <DriverHomePage /> : <RiderHomePage />}
                </div>
            )}
        </div>


    );
}

export default App;