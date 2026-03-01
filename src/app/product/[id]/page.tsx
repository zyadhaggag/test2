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
import { ProductCard } from '@/components/ui/product-card';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
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
            if (data) {
                setProduct(data);
                const { data: related } = await supabase
                    .from('products')
                    .select('*, category:categories(*)')
                    .eq('status', 'active')
                    .neq('id', id)
                    .limit(4);
                if (related) setRelatedProducts(related);
            }
            setLoading(false);
        }
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        setIsAdding(true);
        setTimeout(() => {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
            });
            addNotification('cart', `تمت الإضافة: ${product.name}`, 3000);
            setIsAdding(false);
        }, 500);
    };

    const handleBuyNow = () => {
        if (!product) return;
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
        });
        router.push('/cart');
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
                    <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
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
            <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 pb-32 sm:pb-8">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-sm text-ultra-silver-muted hover:text-ultra-silver-bright transition-colors mb-6 group"
                >
                    <ArrowRight size={16} className="group-hover:-translate-x-1 transition-transform" />
                    العودة
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <div className="relative aspect-[2/3] bg-ultra-card border border-ultra-border rounded-ultra overflow-hidden">
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
                                disabled={isAdding}
                                className="flex-1 flex items-center justify-center gap-3 bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-bold py-3.5 rounded-ultra transition-all duration-ultra hover:bg-ultra-card hover:shadow-glow disabled:opacity-50"
                            >
                                {isAdding ? (
                                    <div className="w-[18px] h-[18px] rounded-full border-t-2 border-ultra-silver-bright animate-spin shrink-0"></div>
                                ) : (
                                    <ShoppingCart size={18} />
                                )}
                                {isAdding ? 'جاري الإضافة...' : 'إضافة إلى السلة'}
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

                {/* Sticky Bottom Bar */}
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-ultra-bg-secondary/95 backdrop-blur-md border-t border-ultra-border p-3 sm:p-4 flex items-center justify-between gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] animate-[slideUp_0.3s_ease] pb-safe sm:pb-4">
                    <div className="flex flex-col max-w-[30%] sm:max-w-[50%]">
                        <span className="text-sm sm:text-base font-bold text-ultra-silver-bright line-clamp-1">{product.name}</span>
                        <div className="flex items-center gap-1">
                            <span className="font-extrabold text-sm sm:text-lg text-white">{product.price}</span>
                            <Image src="/ryal.svg" alt="ريال" width={14} height={14} />
                        </div>
                    </div>
                    <div className="flex gap-2 sm:gap-4 flex-1 justify-end">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className="flex-1 max-w-[150px] shrink-0 flex items-center justify-center gap-1 sm:gap-2 bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-bold px-2 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-ultra hover:bg-ultra-card shadow-ultra disabled:opacity-50 text-xs sm:text-sm"
                        >
                            {isAdding ? (
                                <div className="w-4 h-4 rounded-full border-t-2 border-ultra-silver-bright animate-spin shrink-0"></div>
                            ) : (
                                <ShoppingCart size={16} className="hidden sm:block" />
                            )}
                            {isAdding ? 'جاري...' : 'أضف للسلة'}
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="flex-1 max-w-[150px] shrink-0 flex items-center justify-center gap-2 bg-ultra-silver-bright text-ultra-bg font-extrabold px-2 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-ultra hover:bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)] text-xs sm:text-sm"
                        >
                            اشتري الآن
                        </button>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16 sm:mt-24">
                        <h2 className="text-xl sm:text-2xl font-bold text-ultra-silver-bright mb-6">قد يعجبك أيضاً</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
            <SidebarChat />
        </>
    );
}
