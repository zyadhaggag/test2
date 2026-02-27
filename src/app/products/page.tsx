'use client';

import { useEffect, useState, Suspense } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SidebarChat } from '@/components/layout/sidebar-chat';
import { ProductCard } from '@/components/ui/product-card';
import type { Product } from '@/lib/supabase/types';
import { useSearchParams } from 'next/navigation';

function ProductsList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    useEffect(() => {
        const supabase = createClient();

        async function fetchProducts() {
            let supabaseQuery = supabase
                .from('products')
                .select('*, category:categories(*)')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (query) {
                // If there's a search term, filter by name or description.
                supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
            }

            const { data } = await supabaseQuery;
            if (data) setProducts(data);
            setLoading(false);
        }

        fetchProducts();

        const channel = supabase
            .channel('products-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
                fetchProducts();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [query]);

    return (
        <>
            <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="mb-8">
                    <h1 className=" font-extrabold text-3xl text-ultra-silver-bright">
                        {query ? `نتائج البحث عن: "${query}"` : 'جميع المنتجات'}
                    </h1>
                    <p className="text-ultra-silver-muted mt-2">
                        {query ? 'تصفح النتائج المطابقة لبحثك' : 'اكتشف مجموعتنا الكاملة من المنتجات المميزة'}
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-ultra-card border border-ultra-border rounded-ultra h-80 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-ultra-silver-muted text-lg">لا توجد منتجات حالياً</p>
                    </div>
                )}
            </main>
        </>
    );
}

export default function ProductsPage() {
    return (
        <>
            <Header />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 rounded-full border-t-2 border-ultra-silver-bright animate-spin"></div></div>}>
                <ProductsList />
            </Suspense>
            <Footer />
            <SidebarChat />
        </>
    );
}
