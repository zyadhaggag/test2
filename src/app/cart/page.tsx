'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus, Trash2, ShoppingBasket, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useNotificationStore } from '@/stores/notification-store';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function CartPage() {
    const { items, removeItem, clearCart, getTotal } = useCartStore();
    const addNotification = useNotificationStore((s) => s.addNotification);
    const [clearing, setClearing] = useState(false);

    const handleClear = () => {
        setClearing(true);
        setTimeout(() => {
            clearCart();
            addNotification('success', 'تم تفريغ السلة');
            setClearing(false);
        }, 300);
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-ultra-bg py-8 px-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Page Title */}
                    <div className="flex items-center justify-between">
                        <h1 className=" font-extrabold text-2xl text-ultra-silver-bright flex items-center gap-3">
                            <ShoppingBasket size={24} />
                            سلة التسوق
                        </h1>
                        {items.length > 0 && (
                            <button
                                onClick={handleClear}
                                disabled={clearing}
                                className="flex items-center gap-2 text-sm text-ultra-silver-dark hover:text-ultra-silver-muted transition-colors"
                            >
                                <Trash2 size={16} />
                                تفريغ السلة
                            </button>
                        )}
                    </div>

                    {items.length === 0 ? (
                        /* Empty Cart */
                        <div className="text-center py-20 space-y-4">
                            <ShoppingBasket size={60} className="mx-auto text-ultra-silver-dark" />
                            <h2 className=" font-bold text-xl text-ultra-silver-muted">السلة فارغة</h2>
                            <p className="text-sm text-ultra-silver-dark">لم تضف أي منتجات بعد</p>
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-bold rounded-xl hover:bg-ultra-card hover:shadow-glow transition-all duration-ultra"
                            >
                                تصفح المنتجات
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-3">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-ultra-card border border-ultra-border rounded-ultra p-4 flex gap-4 items-center transition-all hover:border-ultra-silver-dark/30"
                                    >
                                        {/* Product Image */}
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-ultra-surface flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className=" font-bold text-sm text-ultra-silver-bright truncate">{item.name}</h3>
                                            <div className="flex items-center gap-1 mt-1">
                                                <span className="text-sm font-bold text-ultra-silver-bright">{item.price}</span>
                                                <Image src="/ryal.svg" alt="ر.س" width={14} height={14} />
                                            </div>
                                        </div>

                                        {/* Quantity */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-ultra-silver-muted px-3 py-1 bg-ultra-bg rounded-lg border border-ultra-border">
                                                الكمية: 1
                                            </span>
                                        </div>

                                        {/* Subtotal */}
                                        <div className="text-left min-w-[70px]">
                                            <div className="flex items-center gap-1 justify-end">
                                                <span className="text-sm font-bold text-ultra-silver-bright">{(item.price * item.quantity).toFixed(2)}</span>
                                                <Image src="/ryal.svg" alt="ر.س" width={12} height={12} />
                                            </div>
                                        </div>

                                        {/* Remove */}
                                        <button
                                            onClick={() => { removeItem(item.id); addNotification('success', 'تم حذف المنتج'); }}
                                            className="p-2 text-ultra-silver-dark hover:text-ultra-silver-muted transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-ultra-card border border-ultra-border rounded-ultra p-6 space-y-4 sticky top-24">
                                    <h3 className=" font-bold text-lg text-ultra-silver-bright">ملخص الطلب</h3>

                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between text-ultra-silver-muted">
                                            <span>عدد المنتجات</span>
                                            <span>{items.length}</span>
                                        </div>
                                        <div className="flex justify-between text-ultra-silver-muted">
                                            <span>المجموع الفرعي</span>
                                            <div className="flex items-center gap-1">
                                                <span>{getTotal().toFixed(2)}</span>
                                                <Image src="/ryal.svg" alt="ر.س" width={12} height={12} />
                                            </div>
                                        </div>
                                        <div className="flex justify-between text-ultra-silver-muted">
                                            <span>الشحن</span>
                                            <span className="text-ultra-silver-bright">مجاني</span>
                                        </div>
                                        <div className="border-t border-ultra-border pt-3 flex justify-between font-bold text-ultra-silver-bright text-base">
                                            <span>الإجمالي</span>
                                            <div className="flex items-center gap-1">
                                                <span>{getTotal().toFixed(2)}</span>
                                                <Image src="/ryal.svg" alt="ر.س" width={14} height={14} />
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        href="/checkout"
                                        className="block w-full text-center bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-bold py-3.5 rounded-xl transition-all duration-ultra hover:bg-ultra-card hover:shadow-glow"
                                    >
                                        إتمام الطلب
                                    </Link>

                                    <Link
                                        href="/products"
                                        className="block w-full text-center text-sm text-ultra-silver-muted hover:text-ultra-silver-bright transition-colors"
                                    >
                                        مواصلة التسوق
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
