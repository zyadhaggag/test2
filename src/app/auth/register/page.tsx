'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/stores/auth-store';
import { useNotificationStore } from '@/stores/notification-store';
import { Eye, EyeOff, Phone } from 'lucide-react';

function RegisterForm() {
    const searchParams = useSearchParams();
    const prefilledPhone = searchParams.get('phone') || '';
    const phoneVerified = searchParams.get('verified') === 'true';

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(prefilledPhone);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuthStore();
    const addNotification = useNotificationStore((s) => s.addNotification);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await signUp(email, password, fullName);
        setLoading(false);
        if (error) {
            addNotification('error', error);
        } else {
            addNotification('success', 'تم إنشاء الحساب بنجاح. يرجى تأكيد بريدك الإلكتروني.');
            router.push('/auth/login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-ultra-bg px-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Link href="/">
                        <Image src="/imgs/logo/logo.png" alt="ULTRA" width={160} height={50} className="mx-auto h-14 w-auto" />
                    </Link>
                    <h1 className=" font-extrabold text-2xl text-ultra-silver-bright mt-6">إنشاء حساب</h1>
                    <p className="text-ultra-silver-muted mt-2 text-sm">انضم إلى ULTRA</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-ultra-card border border-ultra-border rounded-ultra p-8 space-y-6 shadow-ultra">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-ultra-silver-muted">الاسم الكامل</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-3 text-sm text-ultra-silver-bright placeholder:text-ultra-silver-dark outline-none focus:border-ultra-silver-muted transition-colors duration-ultra"
                            placeholder="الاسم الكامل"
                        />
                    </div>

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
                                minLength={6}
                                className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-3 text-sm text-ultra-silver-bright placeholder:text-ultra-silver-dark outline-none focus:border-ultra-silver-muted transition-colors duration-ultra"
                                placeholder="6 أحرف على الأقل"
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

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-ultra-silver-muted">
                            رقم الجوال <span className="text-ultra-silver-dark">(اختياري)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-3 pl-12 text-sm text-ultra-silver-bright placeholder:text-ultra-silver-dark outline-none focus:border-ultra-silver-muted transition-colors duration-ultra"
                                placeholder="05XXXXXXXX"
                                dir="ltr"
                                readOnly={phoneVerified}
                            />
                            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ultra-silver-dark" />
                            {phoneVerified && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-full text-[10px] bg-ultra-surface text-ultra-silver-bright border border-ultra-border">
                                    موثق
                                </span>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-bold py-3.5 rounded-xl transition-all duration-ultra hover:bg-ultra-card hover:shadow-glow disabled:opacity-50"
                    >
                        {loading ? 'جاري التسجيل...' : 'إنشاء حساب'}
                    </button>

                    <p className="text-center text-sm text-ultra-silver-muted">
                        لديك حساب بالفعل؟{' '}
                        <Link href="/auth/login" className="text-ultra-silver-bright hover:text-ultra-hover transition-colors">
                            تسجيل الدخول
                        </Link>
                    </p>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-ultra-border" /></div>
                        <div className="relative flex justify-center text-xs"><span className="bg-ultra-card px-4 text-ultra-silver-dark">أو</span></div>
                    </div>

                    <Link
                        href="/auth/phone-login"
                        className="w-full flex items-center justify-center gap-2 bg-ultra-bg border border-ultra-border text-ultra-silver-muted font-bold py-3 rounded-xl transition-all duration-ultra hover:bg-ultra-surface hover:text-ultra-silver-bright"
                    >
                        <Phone size={18} />
                        التسجيل بالجوال
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-ultra-bg"><div className="w-8 h-8 border-2 border-ultra-border border-t-ultra-silver-bright rounded-full animate-spin" /></div>}>
            <RegisterForm />
        </Suspense>
    );
}
