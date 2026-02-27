'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SidebarChat } from '@/components/layout/sidebar-chat';
import { ProductCard } from '@/components/ui/product-card';
import type { Product, Category } from '@/lib/supabase/types';

export default function CategoryPage() {
    const { slug } = useParams();
    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        async function fetchCategory() {
            const { data: cat } = await supabase.from('categories').select('*').eq('slug', slug).single();
            if (cat) {
                setCategory(cat);
                const { data: prods } = await supabase
                    .from('products')
                    .select('*, category:categories(*)')
                    .eq('category_id', cat.id)
                    .eq('status', 'active')
                    .order('created_at', { ascending: false });
                if (prods) setProducts(prods);
            }
            setLoading(false);
        }
        fetchCategory();
    }, [slug]);

    return (
        <>
            <Header />
            <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="mb-8">
                    <h1 className=" font-extrabold text-3xl text-ultra-silver-bright">
                        {loading ? '...' : category?.name || 'القسم غير موجود'}
                    </h1>
                    {category?.description && (
                        <p className="text-ultra-silver-muted mt-2">{category.description}</p>
                    )}
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

                {!loading && products.length === 0 && category && (
                    <div className="text-center py-20">
                        <p className="text-ultra-silver-muted text-lg">لا توجد منتجات في هذا القسم حالياً</p>
                    </div>
                )}
            </main>
            <Footer />
            <SidebarChat />
        </>
    );
}
