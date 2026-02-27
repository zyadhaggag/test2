'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/stores/auth-store';
import { useNotificationStore } from '@/stores/notification-store';
import { Eye, EyeOff, Phone } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuthStore();
    const addNotification = useNotificationStore((s) => s.addNotification);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await signIn(email, password);
        setLoading(false);
        if (error) {
            addNotification('error', error);
        } else {
            addNotification('success', 'تم تسجيل الدخول بنجاح');
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-ultra-bg px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Link href="/">
                        <Image src="/imgs/logo/logo.png" alt="ULTRA" width={160} height={50} className="mx-auto h-14 w-auto" />
                    </Link>
                    <h1 className=" font-extrabold text-2xl text-ultra-silver-bright mt-6">تسجيل الدخول</h1>
                    <p className="text-ultra-silver-muted mt-2 text-sm">مرحباً بعودتك</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-ultra-card border border-ultra-border rounded-ultra p-8 space-y-6 shadow-ultra">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-ultra-silver-muted">البريد الإلكتروني</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-3 text-sm text-ultra-silver-bright placeholder:text-ultra-silver-dark outline-none focus:border-ultra-silver-muted transition-colors duration-ultra"
                            placeholder="example@email.com"
                            dir="ltr"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-ultra-silver-muted">كلمة المرور</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-3 text-sm text-ultra-silver-bright placeholder:text-ultra-silver-dark outline-none focus:border-ultra-silver-muted transition-colors duration-ultra"
                                placeholder="********"
                                dir="ltr"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-ultra-silver-dark hover:text-ultra-silver-muted transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-bold py-3.5 rounded-xl transition-all duration-ultra hover:bg-ultra-card hover:shadow-glow disabled:opacity-50"
                    >
                        {loading ? 'جاري التسجيل...' : 'تسجيل الدخول'}
                    </button>

                    <p className="text-center text-sm text-ultra-silver-muted">
                        ليس لديك حساب؟{' '}
                        <Link href="/auth/register" className="text-ultra-silver-bright hover:text-ultra-hover transition-colors">
                            إنشاء حساب
                        </Link>
                    </p>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ultra-border" /></div>
                        <div className="relative flex justify-center text-xs"><span className="bg-ultra-card px-4 text-ultra-silver-dark">أو</span></div>
                    </div>

                    <button
                        type="button"
                        onClick={async () => {
                            const supabase = (await import('@/lib/supabase/client')).createClient();
                            await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } });
                        }}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-800 font-bold py-3.5 rounded-xl transition-all hover:bg-gray-50 hover:shadow-glow"
                    >
                        <svg width="20" height="20" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        تسجيل الدخول باستخدام Google
                    </button>

                    <Link
                        href="/auth/phone-login"
                        className="w-full flex items-center justify-center gap-2 bg-ultra-bg border border-ultra-border text-ultra-silver-muted font-bold py-3.5 rounded-xl transition-all duration-ultra hover:bg-ultra-surface hover:text-ultra-silver-bright"
                    >
                        <Phone size={18} />
                        تسجيل الدخول بالجوال
                    </Link>
                </form>
            </div>
        </div>
    );
}
