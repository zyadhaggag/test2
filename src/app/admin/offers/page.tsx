'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useNotificationStore } from '@/stores/notification-store';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import type { Offer } from '@/lib/supabase/types';

export default function AdminOffersPage() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Offer | null>(null);
    const addNotification = useNotificationStore((s) => s.addNotification);

    const emptyForm = { title: '', description: '', product_id: '', discount_percent: 0, start_date: '', end_date: '', status: 'active' as 'active' | 'expired' | 'draft', image: '' };
    const [form, setForm] = useState(emptyForm);
    const supabase = useMemo(() => createClient(), []);

    const fetchOffers = useCallback(async () => {
        const { data } = await supabase.from('offers').select('*, product:products(name)').order('created_at', { ascending: false });
        if (data) setOffers(data);
        setLoading(false);
    }, [supabase, setLoading]);

    useEffect(() => { fetchOffers(); }, [fetchOffers]);

    const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
    const openEdit = (o: Offer) => {
        setEditing(o);
        setForm({ title: o.title, description: o.description, product_id: o.product_id || '', discount_percent: o.discount_percent, start_date: o.start_date?.split('T')[0] || '', end_date: o.end_date?.split('T')[0] || '', status: o.status as 'active', image: o.image || '' });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { title: form.title, description: form.description, product_id: form.product_id || null, discount_percent: Number(form.discount_percent), start_date: form.start_date, end_date: form.end_date, status: form.status, image: form.image || null };
        if (editing) {
            const { error } = await supabase.from('offers').update(payload).eq('id', editing.id);
            if (error) { addNotification('error', 'فشل التعديل'); return; }
            addNotification('success', 'تم تعديل العرض');
        } else {
            const { error } = await supabase.from('offers').insert(payload);
            if (error) { addNotification('error', 'فشل الإضافة'); return; }
            addNotification('success', 'تم إضافة العرض');
        }
        setShowModal(false); fetchOffers();
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('offers').delete().eq('id', id);
        if (error) { addNotification('error', 'فشل الحذف'); return; }
        addNotification('success', 'تم حذف العرض'); fetchOffers();
    };

    const statusLabel: Record<string, string> = { active: 'نشط', expired: 'منتهي', draft: 'مسودة' };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className=" font-bold text-2xl text-ultra-silver-bright">إدارة العروض</h2>
                <button onClick={openCreate} className="flex items-center gap-2 bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-medium px-5 py-2.5 rounded-xl transition-all duration-ultra hover:bg-ultra-card hover:shadow-glow"><Plus size={18} /> إضافة عرض</button>
            </div>

            {loading ? (
                <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => (<div key={i} className="h-16 bg-ultra-card border border-ultra-border rounded-xl animate-pulse" />))}</div>
            ) : (
                <div className="bg-ultra-card border border-ultra-border rounded-ultra overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="border-b border-ultra-border">
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">العنوان</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">الخصم</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">البداية</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">النهاية</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">الحالة</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">إجراءات</th>
                            </tr></thead>
                            <tbody>
                                {offers.map((o) => (
                                    <tr key={o.id} className="border-b border-ultra-border/50 hover:bg-ultra-surface/30 transition-colors">
                                        <td className="px-4 py-3 text-ultra-silver-bright font-medium">{o.title}</td>
                                        <td className="px-4 py-3 text-ultra-silver-bright">{o.discount_percent}%</td>
                                        <td className="px-4 py-3 text-ultra-silver-muted text-xs">{new Date(o.start_date).toLocaleDateString('ar-SA')}</td>
                                        <td className="px-4 py-3 text-ultra-silver-muted text-xs">{new Date(o.end_date).toLocaleDateString('ar-SA')}</td>
                                        <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${o.status === 'active' ? 'bg-ultra-surface text-ultra-silver-bright' : 'bg-ultra-bg text-ultra-silver-dark'}`}>{statusLabel[o.status]}</span></td>
                                        <td className="px-4 py-3"><div className="flex items-center gap-2">
                                            <button onClick={() => openEdit(o)} className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><Pencil size={15} /></button>
                                            <button onClick={() => handleDelete(o.id)} className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><Trash2 size={15} /></button>
                                        </div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
                    <div className="bg-ultra-bg-secondary border border-ultra-border rounded-ultra p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-ultra" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className=" font-bold text-xl text-ultra-silver-bright">{editing ? 'تعديل العرض' : 'إضافة عرض'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div><label className="block text-xs text-ultra-silver-muted mb-1">العنوان</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none focus:border-ultra-silver-muted" /></div>
                            <div><label className="block text-xs text-ultra-silver-muted mb-1">الوصف</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none focus:border-ultra-silver-muted resize-none" /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs text-ultra-silver-muted mb-1">نسبة الخصم %</label><input type="number" min="0" max="100" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: Number(e.target.value) })} required className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none" dir="ltr" /></div>
                                <div><label className="block text-xs text-ultra-silver-muted mb-1">الحالة</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'active' })} className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none"><option value="active">نشط</option><option value="draft">مسودة</option><option value="expired">منتهي</option></select></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs text-ultra-silver-muted mb-1">تاريخ البداية</label><input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none" /></div>
                                <div><label className="block text-xs text-ultra-silver-muted mb-1">تاريخ النهاية</label><input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none" /></div>
                            </div>
                            <div><label className="block text-xs text-ultra-silver-muted mb-1">معرف المنتج (اختياري)</label><input value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })} className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none" dir="ltr" /></div>
                            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} folder="offers" label="صورة العرض" />
                            <button type="submit" className="w-full bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-bold py-3 rounded-xl transition-all duration-ultra hover:bg-ultra-card hover:shadow-glow">{editing ? 'حفظ التعديلات' : 'إضافة العرض'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
