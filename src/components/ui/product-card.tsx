'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { useNotificationStore } from '@/stores/notification-store';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useLoadingStore } from '@/stores/loading-store';
import { useFavoritesStore } from '@/stores/favorites-store';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/supabase/types';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((s) => s.addItem);
    const addNotification = useNotificationStore((s) => s.addNotification);
    const { user, isAuthenticated } = useAuthStore();
    const favorites = useFavoritesStore((s) => s.favorites);
    const toggleFavoriteStore = useFavoritesStore((s) => s.toggleFavorite);
    const router = useRouter();
    const setLoading = useLoadingStore((s) => s.setLoading);
    const isFavorite = favorites.includes(product.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            addNotification('error', 'يجب تسجيل الدخول أولاً');
            router.push('/auth/login');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
            });
            addNotification('success', 'تم إضافة المنتج إلى السلة');
            setLoading(false);
        }, 500);
    };

    const handleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated || !user) {
            addNotification('error', 'يجب تسجيل الدخول أولاً');
            router.push('/auth/login');
            return;
        }

        toggleFavoriteStore(user.id, product.id);
    };

    return (
        <Link href={`/product/${product.id}`} className="block group">
            <div className="bg-ultra-card border border-ultra-border rounded-ultra overflow-hidden transition-all duration-ultra hover:shadow-glow hover:scale-[1.02] hover:border-ultra-silver-dark/40 flex flex-col h-full">
                {/* 
                  Using aspect-[2/3] for taller, portrait-oriented cards 
                  as requested. 
                */}
                <div className="relative w-full aspect-[2/3] overflow-hidden bg-ultra-bg-secondary flex-shrink-0">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    {product.is_new && (
                        <span className="absolute top-3 right-3 bg-ultra-surface/90 backdrop-blur-sm text-ultra-silver-bright text-xs font-bold px-3 py-1 rounded-full border border-ultra-border">
                            جديد
                        </span>
                    )}
                    {product.category && (
                        <span className="absolute top-3 left-3 bg-ultra-bg/80 backdrop-blur-sm text-ultra-silver-muted text-xs px-3 py-1 rounded-full border border-ultra-border">
                            {product.category.name}
                        </span>
                    )}
                    <button
                        onClick={handleFavorite}
                        className="absolute bottom-3 left-3 w-9 h-9 rounded-full bg-ultra-bg/70 backdrop-blur-sm border border-ultra-border flex items-center justify-center transition-all duration-ultra hover:bg-ultra-surface hover:scale-110"
                    >
                        <Heart
                            size={16}
                            className={isFavorite ? 'fill-ultra-silver-bright text-ultra-silver-bright' : 'text-ultra-silver-muted'}
                        />
                    </button>
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-grow w-full space-y-2 sm:space-y-3">
                    <h3 className=" font-bold text-ultra-silver-bright text-xs sm:text-sm leading-tight line-clamp-2 min-h-[36px] sm:min-h-[40px]">
                        {product.name}
                    </h3>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={12}
                                className={
                                    i < Math.round(product.rating)
                                        ? 'fill-ultra-accent text-ultra-accent sm:w-[13px] sm:h-[13px]'
                                        : 'text-ultra-silver-dark sm:w-[13px] sm:h-[13px]'
                                }
                            />
                        ))}
                        <span className="text-[10px] sm:text-xs text-ultra-silver-muted mr-1">
                            ({product.rating})
                        </span>
                    </div>

                    <div className="flex items-center justify-between w-full mt-auto pt-1 sm:pt-2">
                        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                            <div className="flex items-center gap-1">
                                <span className=" font-bold text-sm sm:text-lg text-ultra-silver-bright">
                                    {product.price}
                                </span>
                                <Image src="/ryal.svg" alt="ريال" width={12} height={12} className="sm:w-[18px] sm:h-[18px]" />
                            </div>
                            {product.old_price && (
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] sm:text-sm text-ultra-silver-dark line-through">
                                        {product.old_price}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="w-full flex items-center justify-center gap-1 sm:gap-2 bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-bold py-1.5 sm:py-2 rounded-xl transition-all duration-ultra hover:bg-ultra-card hover:shadow-glow text-xs sm:text-sm"
                    >
                        <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">إضافة للسلة</span>
                        <span className="sm:hidden">أضف</span>
                    </button>
                </div>
            </div>
        </Link>
    );
}
