'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useDialectStore, useTranslation } from '@/stores/dialect-store';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { LogOut, Settings, CreditCard, Heart, MapPin, ChevronLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
    const { user, isAuthenticated, isLoading, signOut } = useAuthStore();
    const { dialect, setDialect } = useDialectStore();
    const { t } = useTranslation();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isLoading, isAuthenticated, router]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut();
        router.push('/');
    };

    if (isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="w-8 h-8 rounded-full border-t-2 border-ultra-silver-bright animate-spin"></div>
            </div>
        );
    }

    const dialects = [
        { id: 'saudi', name: 'السعودية', flag: '🇸🇦' },
        { id: 'egyptian', name: 'مصر', flag: '🇪🇬' },
        { id: 'syrian', name: 'سوريا', flag: '🇸🇾' },
        { id: 'jordanian', name: 'الأردن', flag: '🇯🇴' },
    ];

    return (
        <div className="min-h-screen pt-24 pb-32">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
                {/* Header */}
                <h1 className="text-3xl font-bold text-ultra-silver-bright">{t('profile')}</h1>

                {/* Profile Card */}
                <div className="bg-ultra-surface p-6 rounded-3xl border border-ultra-border flex items-center gap-6 shadow-ultra">
                    <div className="relative w-20 h-20 rounded-full bg-ultra-card border border-ultra-border overflow-hidden shrink-0">
                        <Image src={user?.avatar_url || '/usr.svg'} alt={user?.full_name || 'User'} fill className="object-cover p-3" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">{user?.full_name || 'مستخدم ألترا'}</h2>
                        <p className="text-ultra-silver-muted font-mono">{user?.phone_number || user?.email || 'لا يوجد رقم'}</p>
                    </div>
                </div>

                {/* Dialect Selection */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-ultra-silver-bright">اللهجة واللغة</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {dialects.map((d) => (
                            <button
                                key={d.id}
                                onClick={() => setDialect(d.id as any)}
                                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-ultra ${dialect === d.id
                                    ? 'bg-ultra-card border-ultra-silver-bright shadow-[0_0_20px_rgba(255,255,255,0.15)] ring-1 ring-ultra-silver-bright/50'
                                    : 'bg-ultra-surface border-ultra-border hover:border-ultra-silver-muted shadow-ultra'
                                    } group`}
                            >
                                <span className="text-4xl mb-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform">{d.flag}</span>
                                <span className={`text-sm font-bold ${dialect === d.id ? 'text-white' : 'text-ultra-silver-muted'}`}>{d.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu List */}
                <div className="bg-ultra-surface rounded-3xl border border-ultra-border overflow-hidden">
                    <button onClick={() => router.push('/cart')} className="w-full flex items-center justify-between p-5 border-b border-ultra-border/50 hover:bg-ultra-hover transition-colors text-right">
                        <div className="flex items-center gap-4 text-ultra-silver-bright">
                            <CreditCard size={22} className="text-ultra-silver-dark" />
                            <span className="font-bold">الطلبات والمشتريات</span>
                        </div>
                        <ChevronLeft size={20} className="text-ultra-silver-muted" />
                    </button>
                    <button onClick={() => router.push('/favorites')} className="w-full flex items-center justify-between p-5 border-b border-ultra-border/50 hover:bg-ultra-hover transition-colors text-right">
                        <div className="flex items-center gap-4 text-ultra-silver-bright">
                            <Heart size={22} className="text-ultra-silver-dark" />
                            <span className="font-bold">المفضلة</span>
                        </div>
                        <ChevronLeft size={20} className="text-ultra-silver-muted" />
                    </button>
                    <button className="w-full flex items-center justify-between p-5 hover:bg-ultra-hover transition-colors text-right">
                        <div className="flex items-center gap-4 text-ultra-silver-bright">
                            <MapPin size={22} className="text-ultra-silver-dark" />
                            <span className="font-bold">العناوين المقبولة</span>
                        </div>
                        <ChevronLeft size={20} className="text-ultra-silver-muted" />
                    </button>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center justify-center gap-2 p-5 rounded-3xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all font-bold mt-8"
                >
                    {isLoggingOut ? (
                        <div className="w-5 h-5 rounded-full border-t-2 border-red-500 animate-spin"></div>
                    ) : (
                        <>
                            <LogOut size={20} />
                            <span>{t('logout')}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
