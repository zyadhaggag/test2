'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useNotificationStore } from '@/stores/notification-store';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { ImageUpload } from '@/components/ui/image-upload';
import type { HeroSlide } from '@/lib/supabase/types';

export default function AdminHeroSlidesPage() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<HeroSlide | null>(null);
    const addNotification = useNotificationStore((s) => s.addNotification);

    const emptyForm = { image: '', link: '', sort_order: 0, is_active: true };
    const [form, setForm] = useState(emptyForm);
    const supabase = useMemo(() => createClient(), []);

    const fetchSlides = useCallback(async () => {
        const { data } = await supabase.from('hero_slides').select('*').order('sort_order');
        if (data) setSlides(data);
        setLoading(false);
    }, [supabase, setLoading]);

    useEffect(() => { fetchSlides(); }, [fetchSlides]);

    const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
    const openEdit = (s: HeroSlide) => {
        setEditing(s);
        setForm({ image: s.image, link: s.link || '', sort_order: s.sort_order, is_active: s.is_active });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { image: form.image, link: form.link || null, sort_order: Number(form.sort_order), is_active: form.is_active };
        if (editing) {
            const { error } = await supabase.from('hero_slides').update(payload).eq('id', editing.id);
            if (error) { addNotification('error', 'فشل التعديل'); return; }
            addNotification('success', 'تم تعديل السلايد');
        } else {
            const { error } = await supabase.from('hero_slides').insert(payload);
            if (error) { addNotification('error', 'فشل الإضافة'); return; }
            addNotification('success', 'تم إضافة السلايد');
        }
        setShowModal(false); fetchSlides();
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('hero_slides').delete().eq('id', id);
        if (error) { addNotification('error', 'فشل الحذف'); return; }
        addNotification('success', 'تم حذف السلايد'); fetchSlides();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className=" font-bold text-2xl text-ultra-silver-bright">إدارة السلايدر</h2>
                <button onClick={openCreate} className="flex items-center gap-2 bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-medium px-5 py-2.5 rounded-xl transition-all duration-ultra hover:bg-ultra-card hover:shadow-glow"><Plus size={18} /> إضافة سلايد</button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => (<div key={i} className="h-40 bg-ultra-card border border-ultra-border rounded-xl animate-pulse" />))}</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {slides.map((s) => (
                        <div key={s.id} className="bg-ultra-card border border-ultra-border rounded-ultra overflow-hidden">
                            <div className="relative h-40">
                                <Image src={s.image} alt="Slide" fill className="object-cover" />
                                <div className="absolute top-3 right-3 flex items-center gap-2">
                                    <span className={`px-2 py-1 rounded-full text-xs ${s.is_active ? 'bg-ultra-surface text-ultra-silver-bright' : 'bg-ultra-bg text-ultra-silver-dark'}`}>
                                        {s.is_active ? 'نشط' : 'معطل'}
                                    </span>
                                    <span className="bg-ultra-bg/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-ultra-silver-muted">
                                        ترتيب: {s.sort_order}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <span className="text-xs text-ultra-silver-muted truncate" dir="ltr">{s.link || 'بدون رابط'}</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><Pencil size={15} /></button>
                                    <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><Trash2 size={15} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
                    <div className="bg-ultra-bg-secondary border border-ultra-border rounded-ultra p-6 w-full max-w-lg shadow-ultra" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className=" font-bold text-xl text-ultra-silver-bright">{editing ? 'تعديل السلايد' : 'إضافة سلايد'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><X size={18} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} folder="hero-slides" label="صورة السلايد" required />
                            <div><label className="block text-xs text-ultra-silver-muted mb-1">الرابط (اختياري)</label><input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none focus:border-ultra-silver-muted" dir="ltr" /></div>
                            <div><label className="block text-xs text-ultra-silver-muted mb-1">الترتيب</label><input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 text-sm text-ultra-silver-bright outline-none" dir="ltr" /></div>
                            <label className="flex items-center gap-2 text-sm text-ultra-silver-muted cursor-pointer"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded" /> نشط</label>
                            <button type="submit" className="w-full bg-ultra-surface border border-ultra-border text-ultra-silver-bright font-bold py-3 rounded-xl transition-all duration-ultra hover:bg-ultra-card hover:shadow-glow">{editing ? 'حفظ التعديلات' : 'إضافة السلايد'}</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
