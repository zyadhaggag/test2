'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { useNotificationStore } from '@/stores/notification-store';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const addNotification = useNotificationStore((s) => s.addNotification);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const supabase = createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/update-password`,
        });

        setLoading(false);
        if (error) {
            addNotification('error', error.message);
        } else {
            addNotification('success', 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
            setSent(true);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-ultra-bg flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md mx-auto space-y-6">
                <div className="text-center">
                    <Link href="/">
                        <Image src="/imgs/logo/logo.png" alt="ULTRA" width={160} height={50} className="mx-auto h-14 w-auto" />
                    </Link>
                    <h1 className=" font-extrabold text-2xl text-ultra-silver-bright mt-6">استعادة استعادة كلمة المرور</h1>
                    <p className="text-ultra-silver-muted mt-2 text-sm">أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة مرورك</p>
                </div>

                <div className="bg-ultra-card border border-ultra-border rounded-ultra p-6 sm:p-8 space-y-6 shadow-ultra">
                    {sent ? (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-ultra-surface rounded-full flex items-center justify-center mx-auto border border-ultra-border mb-4">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                            <h3 className="font-bold text-ultra-silver-bright">تم الإرسال بنجاح!</h3>
                            <p className="text-sm text-ultra-silver-muted">
                                يرجى التحقق من صندوق الوارد الخاص بك (أو مجلد الرسائل المزعجة) واتباع الرابط المرسل لتغيير كلمة المرور الخاصة بك.
                            </p>
                            <Link
                                href="/auth/login"
                                className="inline-block mt-4 text-ultra-silver-bright hover:text-white transition-colors text-sm font-bold"
                            >
                                العودة لتسجيل الدخول
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-bold py-3.5 rounded-xl transition-all duration-ultra hover:bg-ultra-card hover:shadow-glow disabled:opacity-50"
                            >
                                {loading ? 'جاري الإرسال...' : 'إرسال الرابط'}
                            </button>

                            <Link
                                href="/auth/login"
                                className="w-full flex items-center justify-center gap-2 text-sm text-ultra-silver-muted hover:text-ultra-silver-bright transition-colors"
                            >
                                <ArrowLeft size={16} />
                                العودة لتسجيل الدخول
                            </Link>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
