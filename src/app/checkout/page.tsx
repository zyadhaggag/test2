'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { useNotificationStore } from '@/stores/notification-store';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ShieldCheck, Package } from 'lucide-react';

export default function CheckoutPage() {
    const { items, getTotal, clearCart } = useCartStore();
    const { user, isAuthenticated } = useAuthStore();
    const addNotification = useNotificationStore((s) => s.addNotification);
    const router = useRouter();
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone_number || '',
        address: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            addNotification('error', 'السلة فارغة');
            return;
        }

        if (!isAuthenticated) {
            addNotification('error', 'يجب تسجيل الدخول أولاً');
            router.push('/auth/login');
            return;
        }

        setLoading(true);

        try {
            // 1. Create order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user!.id,
                    total: getTotal(),
                    status: 'pending',
                })
                .select()
                .single();

            if (orderError || !order) {
                addNotification('error', 'فشل إنشاء الطلب');
                setLoading(false);
                return;
            }

            // 2. Create order items
            const orderItems = items.map((item) => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                price: item.price,
            }));

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems);

            if (itemsError) {
                addNotification('error', 'فشل حفظ تفاصيل الطلب');
                setLoading(false);
                return;
            }

            // 3. Clear cart
            clearCart();

            // 4. Show success
            addNotification('success', 'تم إنشاء طلبك بنجاح! رقم الطلب: ' + order.id.slice(0, 8));
            router.push('/');
        } catch {
            addNotification('error', 'حدث خطأ غير متوقع');
        }

        setLoading(false);
    };

    return (
        <>
            <Header />
            <main className="min-h-screen bg-ultra-bg py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className=" font-extrabold text-2xl text-ultra-silver-bright mb-8 flex items-center gap-3">
                        <ShieldCheck size={24} />
                        إتمام الطلب
                    </h1>

                    {items.length === 0 ? (
                        <div className="text-center py-20 space-y-4">
                            <Package size={60} className="mx-auto text-ultra-silver-dark" />
                            <p className="text-ultra-silver-muted">السلة فارغة. أضف منتجات قبل إتمام الطلب.</p>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Checkout Form */}
                            <div className="lg:col-span-2">
                                <form onSubmit={handleSubmit} className="bg-ultra-card border border-ultra-border rounded-ultra p-4 sm:p-6 space-y-4 sm:space-y-5">
                                    <h3 className=" font-bold text-lg text-ultra-silver-bright">معلومات التوصيل</h3>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-ultra-silver-muted">الاسم الكامل</label>
                                        <input
                                            type="text"
                                            value={form.full_name}
                                            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                            required
                                            className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-3 text-sm text-ultra-silver-bright placeholder:text-ultra-silver-dark outline-none focus:border-ultra-silver-muted transition-colors duration-ultra"
                                            placeholder="الاسم الكامل"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-ultra-silver-muted">البريد الإلكتروني</label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            required
                                            className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-3 text-sm text-ultra-silver-bright placeholder:text-ultra-silver-dark outline-none focus:border-ultra-silver-muted transition-colors duration-ultra"
                                            placeholder="example@email.com"
                                            dir="ltr"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-ultra-silver-muted">رقم الجوال</label>
                                        <input
                                            type="tel"
                                            value={form.phone}
                                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                            required
                                            className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-3 text-sm text-ultra-silver-bright placeholder:text-ultra-silver-dark outline-none focus:border-ultra-silver-muted transition-colors duration-ultra"
                                            placeholder="05XXXXXXXX"
                                            dir="ltr"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-ultra-silver-muted">العنوان</label>
                                        <textarea
                                            value={form.address}
                                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                                            required
                                            rows={3}
                                            className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-3 text-sm text-ultra-silver-bright placeholder:text-ultra-silver-dark outline-none focus:border-ultra-silver-muted transition-colors duration-ultra resize-none"
                                            placeholder="المنطقة، المدينة، الحي، الشارع"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-bold py-3.5 rounded-xl transition-all duration-ultra hover:bg-ultra-card hover:shadow-glow disabled:opacity-50"
                                    >
                                        {loading ? 'جاري إرسال الطلب...' : 'تأكيد الطلب'}
                                    </button>
                                </form>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-ultra-card border border-ultra-border rounded-ultra p-4 sm:p-6 space-y-4 sticky top-24">
                                    <h3 className=" font-bold text-lg text-ultra-silver-bright">ملخص الطلب</h3>

                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-3 items-center">
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-ultra-surface flex-shrink-0">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-ultra-silver-bright truncate">{item.name}</p>
                                                    <p className="text-xs text-ultra-silver-dark">{item.quantity}x</p>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-ultra-silver-bright font-mono">
                                                    <span>{(item.price * item.quantity).toFixed(2)}</span>
                                                    <Image src="/ryal.svg" alt="ر.س" width={10} height={10} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-ultra-border pt-3 space-y-2 text-sm">
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
                                        <div className="border-t border-ultra-border pt-2 flex justify-between font-bold text-ultra-silver-bright text-base">
                                            <span>الإجمالي</span>
                                            <div className="flex items-center gap-1">
                                                <span>{getTotal().toFixed(2)}</span>
                                                <Image src="/ryal.svg" alt="ر.س" width={14} height={14} />
                                            </div>
                                        </div>
                                    </div>
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
