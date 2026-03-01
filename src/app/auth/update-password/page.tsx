'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useNotificationStore } from '@/stores/notification-store';
import { Lock } from 'lucide-react';

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const addNotification = useNotificationStore((s) => s.addNotification);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            addNotification('error', 'كلمات المرور غير متطابقة');
            return;
        }

        if (password.length < 6) {
            addNotification('error', 'يجب أن لا تقل كلمة المرور عن 6 أحرف');
            return;
        }

        setLoading(true);
        const supabase = createClient();

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        setLoading(false);
        if (error) {
            addNotification('error', error.message);
        } else {
            addNotification('success', 'تم تغيير كلمة المرور بنجاح');
            setSuccess(true);
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-ultra-bg flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <Link href="/">
                        <Image src="/imgs/logo/logo.png" alt="ULTRA" width={160} height={50} className="mx-auto h-14 w-auto" />
                    </Link>
                    <h1 className=" font-extrabold text-2xl text-ultra-silver-bright mt-6">تعيين كلمة مرور جديدة</h1>
                    <p className="text-ultra-silver-muted mt-2 text-sm">أدخل كلمة المرور الجديدة لحسابك</p>
                </div>

                <div className="bg-ultra-card border border-ultra-border rounded-ultra p-6 sm:p-8 space-y-6 shadow-ultra">
                    {success ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-ultra-surface rounded-full flex items-center justify-center mx-auto border border-ultra-border mb-4">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                            <h3 className="font-bold text-ultra-silver-bright">تم التغيير بنجاح!</h3>
                            <p className="text-sm text-ultra-silver-muted">
                                سيتم توجيهك إلى صفحة تسجيل الدخول...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-ultra-silver-muted mb-2">كلمة المرور الجديدة</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-ultra-silver-muted">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full bg-ultra-surface border border-ultra-border rounded-xl pr-10 pl-4 py-3 text-sm text-ultra-silver-bright placeholder:text-ultra-silver-dark outline-none focus:border-ultra-silver-bright transition-colors duration-ultra"
                                            placeholder="••••••••"
                                            dir="ltr"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-ultra-silver-muted mb-2">تأكيد كلمة المرور</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-ultra-silver-muted">
                                            <Lock size={18} />
                                        </div>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full bg-ultra-surface border border-ultra-border rounded-xl pr-10 pl-4 py-3 text-sm text-ultra-silver-bright placeholder:text-ultra-silver-dark outline-none focus:border-ultra-silver-bright transition-colors duration-ultra"
                                            placeholder="••••••••"
                                            dir="ltr"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-ultra-silver-bright text-ultra-bg font-extrabold py-3.5 rounded-xl hover:bg-white transition-colors shadow-glow mt-4 flex items-center justify-center gap-2"
                            >
                                {loading && <div className="w-5 h-5 border-t-2 border-ultra-bg border-solid rounded-full animate-spin"></div>}
                                {loading ? 'جاري التغيير...' : 'تحديث كلمة المرور'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
