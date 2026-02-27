'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SidebarChat } from '@/components/layout/sidebar-chat';
import { useCartStore } from '@/stores/cart-store';
import { useNotificationStore } from '@/stores/notification-store';
import Image from 'next/image';
import { Star, ShoppingCart, Heart, ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/supabase/types';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);
    const addItem = useCartStore((s) => s.addItem);
    const addNotification = useNotificationStore((s) => s.addNotification);

    useEffect(() => {
        const supabase = createClient();
        async function fetchProduct() {
            const { data } = await supabase
                .from('products')
                .select('*, category:categories(*)')
                .eq('id', id)
                .single();
            if (data) setProduct(data);
            setLoading(false);
        }
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
        });
        addNotification('success', 'تم إضافة المنتج إلى السلة');
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8">
                    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-ultra-card border border-ultra-border rounded-ultra aspect-square" />
                        <div className="space-y-4">
                            <div className="h-8 bg-ultra-card rounded w-3/4" />
                            <div className="h-4 bg-ultra-card rounded w-1/2" />
                            <div className="h-20 bg-ultra-card rounded" />
                            <div className="h-10 bg-ultra-card rounded w-1/3" />
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    if (!product) {
        return (
            <>
                <Header />
                <main className="min-h-screen flex items-center justify-center">
                    <p className="text-ultra-silver-muted text-lg">المنتج غير موجود</p>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-sm text-ultra-silver-muted hover:text-ultra-silver-bright transition-colors mb-6 group"
                >
                    <ArrowRight size={16} className="group-hover:-translate-x-1 transition-transform" />
                    العودة
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="relative aspect-square bg-ultra-card border border-ultra-border rounded-ultra overflow-hidden">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                        {product.is_new && (
                            <span className="absolute top-4 right-4 bg-ultra-surface/90 backdrop-blur-sm text-ultra-silver-bright text-sm font-bold px-4 py-1.5 rounded-full border border-ultra-border">
                                جديد
                            </span>
                        )}
                    </div>

                    <div className="space-y-6">
                        {product.category && (
                            <span className="inline-block bg-ultra-surface text-ultra-silver-muted text-xs px-3 py-1 rounded-full border border-ultra-border">
                                {product.category.name}
                            </span>
                        )}

                        <h1 className=" font-extrabold text-3xl text-ultra-silver-bright">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    size={18}
                                    className={
                                        i < Math.round(product.rating)
                                            ? 'fill-ultra-accent text-ultra-accent'
                                            : 'text-ultra-silver-dark'
                                    }
                                />
                            ))}
                            <span className="text-sm text-ultra-silver-muted">({product.rating})</span>
                        </div>

                        <p className="text-ultra-silver-muted leading-relaxed">{product.description}</p>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className=" font-extrabold text-3xl text-ultra-silver-bright">
                                    {product.price}
                                </span>
                                <Image src="/ryal.svg" alt="ريال" width={24} height={24} />
                            </div>
                            {product.old_price && (
                                <div className="flex items-center gap-1">
                                    <span className="text-lg text-ultra-silver-dark line-through">
                                        {product.old_price}
                                    </span>
                                    <Image src="/ryal.svg" alt="ريال" width={16} height={16} className="opacity-40" />
                                </div>
                            )}
                        </div>

                        {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-ultra-card text-ultra-silver-muted text-xs px-3 py-1 rounded-full border border-ultra-border"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-3 pt-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 flex items-center justify-center gap-3 bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-bold py-3.5 rounded-ultra transition-all duration-ultra hover:bg-ultra-card hover:shadow-glow"
                            >
                                <ShoppingCart size={18} />
                                إضافة إلى السلة
                            </button>
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className="w-14 h-14 rounded-ultra bg-ultra-card border border-ultra-border flex items-center justify-center transition-all duration-ultra hover:bg-ultra-surface"
                            >
                                <Heart
                                    size={20}
                                    className={isFavorite ? 'fill-ultra-silver-bright text-ultra-silver-bright' : 'text-ultra-silver-muted'}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <SidebarChat />
        </>
    );
}
