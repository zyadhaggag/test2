'use client';

import { useState, useEffect } from 'react';
import { useFavoritesModalStore } from '@/stores/favorites-modal-store';
import { useFavoritesStore } from '@/stores/favorites-store';
import { useAuthStore } from '@/stores/auth-store';
import { createClient } from '@/lib/supabase/client';
import { X, Heart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/supabase/types';
import { useNotificationStore } from '@/stores/notification-store';
import { useCartStore } from '@/stores/cart-store';

export function FavoritesModal() {
    const { isOpen, closeModal } = useFavoritesModalStore();
    const { favorites, toggleFavorite } = useFavoritesStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore();
    const addNotification = useNotificationStore(s => s.addNotification);
    const addToCart = useCartStore(s => s.addItem);

    useEffect(() => {
        if (isOpen && favorites.length > 0) {
            fetchFavoriteProducts();
        } else if (isOpen && favorites.length === 0) {
            setProducts([]);
        }
    }, [isOpen, favorites.length]);

    const fetchFavoriteProducts = async () => {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .in('id', favorites);

        if (!error && data) {
            setProducts(data);
        }
        setLoading(false);
    };

    const handleRemove = async (productId: string) => {
        if (!user) return;
        await toggleFavorite(user.id, productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
    };

    const handleAddToCart = (product: Product) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
        });
        addNotification('cart', `تمت الإضافة: ${product.name}`, 3000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-[fadeIn_0.3s_ease]">
            <div className="bg-ultra-card border border-ultra-border rounded-t-3xl sm:rounded-3xl w-full max-w-2xl h-[85vh] sm:h-[80vh] flex flex-col shadow-ultra animate-[slideUp_0.4s_ease-out_forwards]">
                <div className="p-4 sm:p-6 border-b border-ultra-border flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 text-red-500 rounded-xl">
                            <Heart size={24} fill="currentColor" />
                        </div>
                        <h2 className="text-xl font-bold text-white">المفضلة</h2>
                        <span className="bg-ultra-surface border border-ultra-border text-ultra-silver-bright px-3 py-1 rounded-full text-xs font-bold">
                            {favorites.length}
                        </span>
                    </div>
                    <button onClick={closeModal} className="p-2 text-ultra-silver-muted hover:text-white transition-colors bg-ultra-surface rounded-full hover:bg-ultra-border hover:rotate-90 duration-300">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-ultra-surface rounded-2xl h-32 animate-pulse border border-ultra-border"></div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 bg-ultra-surface rounded-full flex items-center justify-center text-ultra-silver-dark border border-ultra-border mb-2">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-ultra-silver-bright">مفضلتك فارغة</h3>
                            <p className="text-sm text-ultra-silver-muted max-w-xs mx-auto">تصفح المنتجات وأضف ما يعجبك هنا للرجوع إليه لاحقاً.</p>
                            <button onClick={closeModal} className="mt-4 px-6 py-2.5 bg-ultra-surface border border-ultra-border text-white rounded-xl hover:bg-ultra-border transition-colors font-bold text-sm shadow-glow">
                                تصفح المنتجات
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {products.map((product) => (
                                <div key={product.id} className="bg-ultra-surface border border-ultra-border rounded-2xl p-3 flex gap-4 items-center group relative overflow-hidden transition-all duration-ultra hover:border-ultra-silver-muted hover:bg-ultra-surface/80">
                                    <Link href={`/product/${product.id}`} onClick={closeModal} className="relative w-24 h-32 shrink-0 rounded-xl overflow-hidden bg-ultra-bg-secondary">
                                        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </Link>
                                    <div className="flex-1 min-w-0 pr-1 space-y-2">
                                        <Link href={`/product/${product.id}`} onClick={closeModal}>
                                            <h3 className="font-bold text-sm text-white line-clamp-2 hover:text-ultra-silver-bright transition-colors leading-relaxed">{product.name}</h3>
                                        </Link>
                                        <div className="font-extrabold text-white text-lg">{product.price.toLocaleString()} ر.س</div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="flex-1 bg-ultra-silver-bright text-ultra-bg text-xs font-bold py-2 px-3 rounded-lg hover:bg-white transition-colors shadow-glow"
                                            >
                                                أضف للسلة
                                            </button>
                                            <button
                                                onClick={() => handleRemove(product.id)}
                                                className="p-2 border border-ultra-border text-ultra-silver-muted rounded-lg hover:text-red-500 hover:border-red-500 hover:bg-red-500/10 transition-colors shrink-0"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
