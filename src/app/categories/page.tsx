'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SidebarChat } from '@/components/layout/sidebar-chat';
import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/lib/supabase/types';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = createClient();
        async function fetchCategories() {
            const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
            if (data) setCategories(data);
            setLoading(false);
        }
        fetchCategories();
    }, []);

    return (
        <>
            <Header />
            <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="mb-8">
                    <h1 className=" font-extrabold text-3xl text-ultra-silver-bright">الأقسام</h1>
                    <p className="text-ultra-silver-muted mt-2">تصفح جميع أقسام المتجر</p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-ultra-card border border-ultra-border rounded-ultra h-40 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/category/${cat.slug}`}
                                className="group bg-ultra-card border border-ultra-border rounded-ultra p-8 text-center transition-all duration-ultra hover:shadow-glow hover:scale-[1.02] hover:border-ultra-silver-dark/40"
                            >
                                {cat.image && (
                                    <div className="relative w-20 h-20 mx-auto mb-4">
                                        <Image src={cat.image} alt={cat.name} fill className="object-contain" />
                                    </div>
                                )}
                                <h3 className=" font-bold text-lg text-ultra-silver-bright mb-2">{cat.name}</h3>
                                <p className="text-xs text-ultra-silver-muted line-clamp-2">{cat.description}</p>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && categories.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-ultra-silver-muted text-lg">لا توجد أقسام حالياً</p>
                    </div>
                )}
            </main>
            <Footer />
            <SidebarChat />
        </>
    );
}
