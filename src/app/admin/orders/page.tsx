'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useNotificationStore } from '@/stores/notification-store';
import type { Order } from '@/lib/supabase/types';

const statusLabels: Record<string, string> = {
    pending: 'قيد الانتظار', processing: 'قيد المعالجة',
    shipped: 'تم الشحن', delivered: 'تم التسليم', cancelled: 'ملغي',
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const addNotification = useNotificationStore((s) => s.addNotification);
    const supabase = useMemo(() => createClient(), []);

    const fetchOrders = useCallback(async () => {
        const { data } = await supabase.from('orders').select('*, profile:profiles(full_name, email)').order('created_at', { ascending: false });
        if (data) setOrders(data);
        setLoading(false);
    }, [supabase, setLoading]);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase.from('orders').update({ status }).eq('id', id);
        if (error) { addNotification('error', 'فشل التحديث'); return; }
        addNotification('success', 'تم تحديث حالة الطلب'); fetchOrders();
    };

    return (
        <div className="space-y-6">
            <h2 className=" font-bold text-2xl text-ultra-silver-bright">إدارة الطلبات</h2>

            {loading ? (
                <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => (<div key={i} className="h-16 bg-ultra-card border border-ultra-border rounded-xl animate-pulse" />))}</div>
            ) : (
                <div className="bg-ultra-card border border-ultra-border rounded-ultra overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="border-b border-ultra-border">
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">رقم الطلب</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">العميل</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">الإجمالي</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">الحالة</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">التاريخ</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">تحديث الحالة</th>
                            </tr></thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr key={o.id} className="border-b border-ultra-border/50 hover:bg-ultra-surface/30 transition-colors">
                                        <td className="px-4 py-3 text-ultra-silver-bright font-mono text-xs">{o.id.slice(0, 8)}...</td>
                                        <td className="px-4 py-3">
                                            <p className="text-ultra-silver-bright text-sm">{(o.profile as unknown as { full_name: string; email: string })?.full_name || '-'}</p>
                                            <p className="text-ultra-silver-dark text-xs">{(o.profile as unknown as { full_name: string; email: string })?.email}</p>
                                        </td>
                                        <td className="px-4 py-3 text-ultra-silver-bright">{o.total} ر.س</td>
                                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${o.status === 'delivered' ? 'bg-ultra-surface text-ultra-silver-bright' : o.status === 'cancelled' ? 'bg-ultra-bg text-ultra-silver-dark' : 'bg-ultra-card text-ultra-silver-muted border border-ultra-border'}`}>{statusLabels[o.status]}</span></td>
                                        <td className="px-4 py-3 text-ultra-silver-muted text-xs">{new Date(o.created_at).toLocaleDateString('ar-SA')}</td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={o.status}
                                                onChange={(e) => updateStatus(o.id, e.target.value)}
                                                className="bg-ultra-surface border border-ultra-border rounded-lg px-3 py-1.5 text-xs text-ultra-silver-bright outline-none"
                                            >
                                                <option value="pending">قيد الانتظار</option>
                                                <option value="processing">قيد المعالجة</option>
                                                <option value="shipped">تم الشحن</option>
                                                <option value="delivered">تم التسليم</option>
                                                <option value="cancelled">ملغي</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!loading && orders.length === 0 && (
                <div className="text-center py-16"><p className="text-ultra-silver-muted">لا توجد طلبات حالياً</p></div>
            )}
        </div>
    );
}
