'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useNotificationStore } from '@/stores/notification-store';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { ImageUpload } from '@/components/ui/image-upload';
import type { Product, Category } from '@/lib/supabase/types';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const addNotification = useNotificationStore((s) => s.addNotification);

    const emptyForm = {
        name: '', description: '', category_id: '', price: 0, old_price: 0,
        image: '', rating: 5, is_new: false, is_featured: false,
        tags: '' as string, status: 'active' as 'active' | 'draft',
    };
    const [form, setForm] = useState(emptyForm);
    const supabase = useMemo(() => createClient(), []);

    const fetchProducts = useCallback(async () => {
        const { data } = await supabase.from('products').select('*, category:categories(name)').order('created_at', { ascending: false });
        if (data) setProducts(data);
        setLoading(false);
    }, [supabase, setLoading]);

    const fetchCategories = useCallback(async () => {
        const { data } = await supabase.from('categories').select('*');
        if (data) setCategories(data);
    }, [supabase]);

    useEffect(() => { fetchProducts(); fetchCategories(); }, [fetchProducts, fetchCategories]);

    const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };

    const openEdit = (p: Product) => {
        setEditing(p);
        setForm({
            name: p.name, description: p.description, category_id: p.category_id || '',
            price: p.price, old_price: p.old_price || 0, image: p.image,
            rating: p.rating, is_new: p.is_new, is_featured: p.is_featured,
            tags: (p.tags || []).join(', '), status: p.status as 'active' | 'draft',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: form.name, description: form.description,
            category_id: form.category_id || null,
            price: Number(form.price), old_price: Number(form.old_price) || null,
            image: form.image, rating: Number(form.rating),
            is_new: form.is_new, is_featured: form.is_featured,
            tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
            status: form.status,
        };

        if (editing) {
            const { error } = await supabase.from('products').update(payload).eq('id', editing.id);
            if (error) { addNotification('error', 'فشل التعديل'); return; }
            addNotification('success', 'تم تعديل المنتج');
        } else {
            const { error } = await supabase.from('products').insert(payload);
            if (error) { addNotification('error', 'فشل الإضافة'); return; }
            addNotification('success', 'تم إضافة المنتج');
        }
        setShowModal(false);
        fetchProducts();
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) { addNotification('error', 'فشل الحذف'); return; }
        addNotification('success', 'تم حذف المنتج');
        fetchProducts();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className=" font-bold text-2xl text-ultra-silver-bright">إدارة المنتجات</h2>
                <button onClick={openCreate} className="flex items-center gap-2 bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-medium px-5 py-2.5 rounded-xl transition-all duration-ultra hover:bg-ultra-card hover:shadow-glow">
                    <Plus size={18} /> إضافة منتج
                </button>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-16 bg-ultra-card border border-ultra-border rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="bg-ultra-card border border-ultra-border rounded-ultra overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-ultra-border">
                                    <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">الصورة</th>
                                    <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">الاسم</th>
                                    <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">القسم</th>
                                    <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">السعر</th>
                                    <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">الحالة</th>
                                    <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">مميز</th>
                                    <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr key={p.id} className="border-b border-ultra-border/50 hover:bg-ultra-surface/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-ultra-surface">
                                                <Image src={p.image} alt={p.name} fill className="object-cover" />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-ultra-silver-bright font-medium">{p.name}</td>
                                        <td className="px-4 py-3 text-ultra-silver-muted">{p.category?.name || '-'}</td>
                                        <td className="px-4 py-3 text-ultra-silver-bright">{p.price} ر.س</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${p.status === 'active' ? 'bg-ultra-surface text-ultra-silver-bright' : 'bg-ultra-bg text-ultra-silver-dark'}`}>
                                                {p.status === 'active' ? 'نشط' : 'مسودة'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-ultra-silver-muted">{p.is_featured ? 'نعم' : 'لا'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><Pencil size={15} /></button>
                                                <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><Trash2 size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
                    <div className="bg-ultra-bg-secondary border border-ultra-border rounded-ultra p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-ultra" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className=" font-bold text-xl text-ultra-silver-bright">{editing ? 'تعديل المنتج' : 'إضافة منتج'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div><label className="block text-xs text-ultra-silver-muted mb-1">الاسم</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none focus:border-ultra-silver-muted" /></div>
                            <div><label className="block text-xs text-ultra-silver-muted mb-1">الوصف</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none focus:border-ultra-silver-muted resize-none" /></div>
                            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} folder="products" label="صورة المنتج" required />
                            <div><label className="block text-xs text-ultra-silver-muted mb-1">القسم</label><select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none"><option value="">بدون قسم</option>{categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}</select></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs text-ultra-silver-muted mb-1">السعر</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none" dir="ltr" /></div>
                                <div><label className="block text-xs text-ultra-silver-muted mb-1">السعر القديم</label><input type="number" value={form.old_price} onChange={(e) => setForm({ ...form, old_price: Number(e.target.value) })} className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none" dir="ltr" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs text-ultra-silver-muted mb-1">التقييم</label><input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none" dir="ltr" /></div>
                                <div><label className="block text-xs text-ultra-silver-muted mb-1">الحالة</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'draft' })} className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none"><option value="active">نشط</option><option value="draft">مسودة</option></select></div>
                            </div>
                            <div><label className="block text-xs text-ultra-silver-muted mb-1">الوسوم (مفصولة بفاصلة)</label><input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none" /></div>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 text-sm text-ultra-silver-muted cursor-pointer"><input type="checkbox" checked={form.is_new} onChange={(e) => setForm({ ...form, is_new: e.target.checked })} className="rounded" /> جديد</label>
                                <label className="flex items-center gap-2 text-sm text-ultra-silver-muted cursor-pointer"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded" /> مميز</label>
                            </div>
                            <button type="submit" className="w-full bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-bold py-3 rounded-xl transition-all duration-ultra hover:bg-ultra-card hover:shadow-glow">{editing ? 'حفظ التعديلات' : 'إضافة المنتج'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
