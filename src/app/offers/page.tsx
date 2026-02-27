'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SidebarChat } from '@/components/layout/sidebar-chat';
import Link from 'next/link';
import type { Offer } from '@/lib/supabase/types';

export default function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        async function fetchOffers() {
            const { data } = await supabase
                .from('offers')
                .select('*, product:products(*)')
                .eq('status', 'active')
                .order('created_at', { ascending: false });
            if (data) setOffers(data);
            setLoading(false);
        }
        fetchOffers();

        const channel = supabase
            .channel('offers-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'offers' }, () => {
                fetchOffers();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    return (
        <>
            <Header />
            <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="mb-8">
                    <h1 className=" font-extrabold text-3xl text-ultra-silver-bright">العروض</h1>
                    <p className="text-ultra-silver-muted mt-2">اكتشف أحدث العروض والخصومات</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-ultra-card border border-ultra-border rounded-ultra h-48 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {offers.map((offer) => (
                            <Link
                                key={offer.id}
                                href={offer.product_id ? `/product/${offer.product_id}` : '#'}
                                className="group bg-ultra-card border border-ultra-border rounded-ultra p-6 transition-all duration-ultra hover:shadow-glow hover:border-ultra-silver-dark/40"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="bg-ultra-surface text-ultra-silver-bright text-sm font-bold px-4 py-1.5 rounded-full border border-ultra-border">
                                        خصم {offer.discount_percent}%
                                    </span>
                                    <div className="text-xs text-ultra-silver-dark space-x-2 space-x-reverse">
                                        <span>من {new Date(offer.start_date).toLocaleDateString('ar-SA')}</span>
                                        <span>-</span>
                                        <span>حتى {new Date(offer.end_date).toLocaleDateString('ar-SA')}</span>
                                    </div>
                                </div>
                                <h3 className=" font-bold text-xl text-ultra-silver-bright mb-2">{offer.title}</h3>
                                <p className="text-sm text-ultra-silver-muted leading-relaxed">{offer.description}</p>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && offers.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-ultra-silver-muted text-lg">لا توجد عروض متاحة حالياً</p>
                    </div>
                )}
            </main>
            <Footer />
            <SidebarChat />
        </>
    );
}
