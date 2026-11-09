import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Label} from "@/components/ui/label.tsx";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface LoginPageProps {
    onLogin: () => void;
    onSwitchToRegister: () => void;
}
export function LoginPage({ onLogin, onSwitchToRegister }: LoginPageProps) {
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const cleanEmail = email.trim();

        try {
            const res = await fetch(API_URL+'/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ email: cleanEmail, password}),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || data.message || 'Dang nhap that bai');
            }

            localStorage.setItem('token', data.token);
            onLogin();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className= "text-2xl">
                        Đăng nhập
                    </CardTitle>
                    <CardDescription> Chào mừng bạn quay lại Uber Clone </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id = "email"
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-sm font-medium text-destructive">{error}</p> }
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        Chưa có tài khoản?{' '}
                        <button
                            onClick={onSwitchToRegister}
                            className="font-semiod text-primary hover:underline"
                            >
                            Đăng ký ngay
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}