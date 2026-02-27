'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useNotificationStore } from '@/stores/notification-store';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import type { Category } from '@/lib/supabase/types';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const addNotification = useNotificationStore((s) => s.addNotification);

    const emptyForm = { name: '', slug: '', description: '', image: '' };
    const [form, setForm] = useState(emptyForm);
    const supabase = useMemo(() => createClient(), []);

    const fetchCategories = useCallback(async () => {
        const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: false });
        if (data) setCategories(data);
        setLoading(false);
    }, [supabase, setLoading]);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
    const openEdit = (c: Category) => {
        setEditing(c);
        setForm({ name: c.name, slug: c.slug, description: c.description, image: c.image || '' });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { name: form.name, slug: form.slug, description: form.description, image: form.image || null };
        if (editing) {
            const { error } = await supabase.from('categories').update(payload).eq('id', editing.id);
            if (error) { addNotification('error', 'فشل التعديل'); return; }
            addNotification('success', 'تم تعديل القسم');
        } else {
            const { error } = await supabase.from('categories').insert(payload);
            if (error) { addNotification('error', 'فشل الإضافة'); return; }
            addNotification('success', 'تم إضافة القسم');
        }
        setShowModal(false); fetchCategories();
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) { addNotification('error', 'فشل الحذف'); return; }
        addNotification('success', 'تم حذف القسم'); fetchCategories();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className=" font-bold text-2xl text-ultra-silver-bright">إدارة الأقسام</h2>
                <button onClick={openCreate} className="flex items-center gap-2 bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-medium px-5 py-2.5 rounded-xl transition-all duration-ultra hover:bg-ultra-card hover:shadow-glow"><Plus size={18} /> إضافة قسم</button>
            </div>

            {loading ? (
                <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => (<div key={i} className="h-16 bg-ultra-card border border-ultra-border rounded-xl animate-pulse" />))}</div>
            ) : (
                <div className="bg-ultra-card border border-ultra-border rounded-ultra overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="border-b border-ultra-border">
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">الاسم</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">الرابط</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">الوصف</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">إجراءات</th>
                            </tr></thead>
                            <tbody>
                                {categories.map((c) => (
                                    <tr key={c.id} className="border-b border-ultra-border/50 hover:bg-ultra-surface/30 transition-colors">
                                        <td className="px-4 py-3 text-ultra-silver-bright font-medium">{c.name}</td>
                                        <td className="px-4 py-3 text-ultra-silver-muted" dir="ltr">{c.slug}</td>
                                        <td className="px-4 py-3 text-ultra-silver-muted text-xs line-clamp-1">{c.description}</td>
                                        <td className="px-4 py-3"><div className="flex items-center gap-2">
                                            <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><Pencil size={15} /></button>
                                            <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><Trash2 size={15} /></button>
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
                    <div className="bg-ultra-bg-secondary border border-ultra-border rounded-ultra p-6 w-full max-w-lg shadow-ultra" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className=" font-bold text-xl text-ultra-silver-bright">{editing ? 'تعديل القسم' : 'إضافة قسم'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div><label className="block text-xs text-ultra-silver-muted mb-1">الاسم</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none focus:border-ultra-silver-muted" /></div>
                            <div><label className="block text-xs text-ultra-silver-muted mb-1">الرابط (slug)</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none focus:border-ultra-silver-muted" dir="ltr" /></div>
                            <div><label className="block text-xs text-ultra-silver-muted mb-1">الوصف</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none focus:border-ultra-silver-muted resize-none" /></div>
                            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} folder="categories" label="صورة القسم" />
                            <button type="submit" className="w-full bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-bold py-3 rounded-xl transition-all duration-ultra hover:bg-ultra-card hover:shadow-glow">{editing ? 'حفظ التعديلات' : 'إضافة القسم'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
