'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SidebarChat } from '@/components/layout/sidebar-chat';
import Image from 'next/image';
import { Star } from 'lucide-react';
import type { Service } from '@/lib/supabase/types';

export default function ServiceDetailPage() {
    const { id } = useParams();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        async function fetchService() {
            const { data } = await supabase.from('services').select('*').eq('id', id).single();
            if (data) setService(data);
            setLoading(false);
        }
        fetchService();
    }, [id]);

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-ultra-card border border-ultra-border rounded-ultra aspect-[4/3]" />
                        <div className="space-y-4">
                            <div className="h-8 bg-ultra-card rounded w-3/4" />
                            <div className="h-20 bg-ultra-card rounded" />
                            <div className="h-10 bg-ultra-card rounded w-1/3" />
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (!service) {
        return (
            <>
                <Header />
                <main className="min-h-screen flex items-center justify-center">
                    <p className="text-ultra-silver-muted text-lg">الخدمة غير موجودة</p>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="relative aspect-[4/3] bg-ultra-card border border-ultra-border rounded-ultra overflow-hidden">
                        <Image src={service.image} alt={service.name} fill className="object-cover" />
                    </div>
                    <div className="space-y-6">
                        <h1 className=" font-extrabold text-3xl text-ultra-silver-bright">{service.name}</h1>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} size={18} className={i < Math.round(service.rating) ? 'fill-ultra-accent text-ultra-accent' : 'text-ultra-silver-dark'} />
                            ))}
                            <span className="text-sm text-ultra-silver-muted">({service.rating})</span>
                        </div>
                        <p className="text-ultra-silver-muted leading-relaxed">{service.description}</p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className=" font-extrabold text-3xl text-ultra-silver-bright">{service.price}</span>
                                <Image src="/ryal.svg" alt="ريال" width={24} height={24} />
                            </div>
                            {service.old_price && (
                                <div className="flex items-center gap-1">
                                    <span className="text-lg text-ultra-silver-dark line-through">{service.old_price}</span>
                                    <Image src="/ryal.svg" alt="ريال" width={16} height={16} className="opacity-40" />
                                </div>
                            )}
                        </div>
                        <button className="w-full bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-bold py-3.5 rounded-ultra transition-all duration-ultra hover:bg-ultra-card hover:shadow-glow">
                            طلب الخدمة
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
            <SidebarChat />
        </>
    );
}
