'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Affiliate {
    id: string;
    full_name: string;
    phone: string;
    links: string;
    created_at: string;
}

export default function AffiliatesAdminPage() {
    const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAffiliates();
    }, []);

    const fetchAffiliates = async () => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('affiliates')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAffiliates(data || []);
        } catch (err: any) {
            console.error('Error fetching affiliates:', err);
            setAffiliates([]);
            setError('تعذر جلب البيانات. قد لا يكون الجدول موجوداً في قاعدة البيانات.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-ultra-silver-muted animate-pulse">جاري تحميل طلبات التسويق...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="font-extrabold text-2xl text-ultra-silver-bright mb-6">طلبات التسويق بالعمولة</h2>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm">
                    {error}
                </div>
            )}

            <div className="bg-ultra-surface border border-ultra-border rounded-2xl overflow-hidden shadow-ultra">
                <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm text-ultra-silver-muted">
                        <thead className="bg-ultra-bg-secondary text-ultra-silver-bright">
                            <tr>
                                <th className="px-6 py-4 font-bold whitespace-nowrap">الاسم</th>
                                <th className="px-6 py-4 font-bold whitespace-nowrap">رقم التواصل</th>
                                <th className="px-6 py-4 font-bold">الروابط / الحسابات</th>
                                <th className="px-6 py-4 font-bold whitespace-nowrap">تاريخ الطلب</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-ultra-border">
                            {affiliates.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-ultra-silver-dark">لا توجد طلبات تسويق حتى الآن.</td>
                                </tr>
                            ) : (
                                affiliates.map((aff) => (
                                    <tr key={aff.id} className="hover:bg-ultra-card transition-colors">
                                        <td className="px-6 py-4 font-bold text-white whitespace-nowrap">{aff.full_name}</td>
                                        <td className="px-6 py-4 font-mono dir-ltr text-right whitespace-nowrap" dir="ltr">{aff.phone}</td>
                                        <td className="px-6 py-4 max-w-xs truncate text-xs" title={aff.links}>{aff.links || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Intl.DateTimeFormat('ar-SA', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hour12: true
                                            }).format(new Date(aff.created_at))}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
