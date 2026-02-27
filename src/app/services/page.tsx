'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SidebarChat } from '@/components/layout/sidebar-chat';
import { ServiceCard } from '@/components/ui/service-card';
import type { Service } from '@/lib/supabase/types';

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();

        async function fetchServices() {
            const { data } = await supabase
                .from('services')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false });
            if (data) setServices(data);
            setLoading(false);
        }

        fetchServices();

        const channel = supabase
            .channel('services-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
                fetchServices();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    return (
        <>
            <Header />
            <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="mb-8">
                    <h1 className=" font-extrabold text-3xl text-ultra-silver-bright">خدماتنا</h1>
                    <p className="text-ultra-silver-muted mt-2">تعرف على جميع الخدمات التي نقدمها</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-ultra-card border border-ultra-border rounded-ultra h-72 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                )}

                {!loading && services.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-ultra-silver-muted text-lg">لا توجد خدمات حالياً</p>
                    </div>
                )}
            </main>
            <Footer />
            <SidebarChat />
        </>
    );
}
