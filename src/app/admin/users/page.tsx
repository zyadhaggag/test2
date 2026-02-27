'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useNotificationStore } from '@/stores/notification-store';
import { Shield, ShieldOff, UserX, UserCheck, Trash2, Phone, CheckCircle, Send } from 'lucide-react';
import type { Profile } from '@/lib/supabase/types';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const addNotification = useNotificationStore((s) => s.addNotification);
    const supabase = useMemo(() => createClient(), []);

    const fetchUsers = useCallback(async () => {
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error('[Admin Users] Fetch error:', error);
            addNotification('error', 'فشل تحميل المستخدمين');
        }
        if (data) setUsers(data);
        setLoading(false);
    }, [supabase, setLoading, addNotification]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const updateRole = async (id: string, role: string) => {
        const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
        if (error) { addNotification('error', 'فشل تحديث الصلاحية'); return; }
        addNotification('success', role === 'admin' ? 'تم ترقية المستخدم إلى مسؤول' : 'تم إزالة صلاحية المسؤول');
        fetchUsers();
    };

    const updateStatus = async (id: string, status: string) => {
        const { error } = await supabase.from('profiles').update({ status }).eq('id', id);
        if (error) { addNotification('error', 'فشل تحديث الحالة'); return; }
        addNotification('success', status === 'suspended' ? 'تم تعليق المستخدم' : 'تم تفعيل المستخدم');
        fetchUsers();
    };

    const deleteUser = async (id: string) => {
        const { error } = await supabase.from('profiles').delete().eq('id', id);
        if (error) { addNotification('error', 'فشل حذف المستخدم'); return; }
        addNotification('success', 'تم حذف المستخدم'); fetchUsers();
    };

    // Manual phone verification by admin
    const manualVerifyPhone = async (id: string) => {
        const { error } = await supabase.from('profiles').update({ phone_verified: true }).eq('id', id);
        if (error) { addNotification('error', 'فشل توثيق الرقم'); return; }
        addNotification('success', 'تم توثيق رقم الهاتف يدوياً');
        fetchUsers();
    };

    // Resend OTP to user's phone
    const resendOTP = async (phone: string) => {
        try {
            const res = await fetch('/api/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });
            const data = await res.json();
            if (!res.ok) {
                addNotification('error', data.error || 'فشل إرسال الرمز');
                return;
            }
            addNotification('success', 'تم إرسال رمز التحقق');
        } catch {
            addNotification('error', 'خطأ في الاتصال');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className=" font-bold text-2xl text-ultra-silver-bright">إدارة المستخدمين</h2>

            {loading ? (
                <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => (<div key={i} className="h-16 bg-ultra-card border border-ultra-border rounded-xl animate-pulse" />))}</div>
            ) : (
                <div className="bg-ultra-card border border-ultra-border rounded-ultra overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="border-b border-ultra-border">
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">المعرف</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">الاسم الكامل</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">البريد الإلكتروني</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">الجوال</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">الصلاحية</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">تاريخ التسجيل</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">الحالة</th>
                                <th className="text-right px-4 py-3 text-ultra-silver-muted font-medium">إجراءات</th>
                            </tr></thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} className="border-b border-ultra-border/50 hover:bg-ultra-surface/30 transition-colors">
                                        <td className="px-4 py-3 text-ultra-silver-muted font-mono text-xs">{u.id.slice(0, 8)}...</td>
                                        <td className="px-4 py-3 text-ultra-silver-bright font-medium">{u.full_name}</td>
                                        <td className="px-4 py-3 text-ultra-silver-muted text-xs" dir="ltr">{u.email}</td>
                                        <td className="px-4 py-3">
                                            {u.phone_number ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-ultra-silver-muted text-xs font-mono" dir="ltr">{u.phone_number}</span>
                                                    {u.phone_verified ? (
                                                        <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-ultra-surface text-ultra-silver-bright border border-ultra-border flex items-center gap-1">
                                                            <CheckCircle size={10} />
                                                            موثق
                                                        </span>
                                                    ) : (
                                                        <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-ultra-bg text-ultra-silver-dark">
                                                            غير موثق
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-ultra-silver-dark text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${u.role === 'admin' ? 'bg-ultra-surface text-ultra-silver-bright border border-ultra-border' : 'bg-ultra-bg text-ultra-silver-muted'}`}>
                                                {u.role === 'admin' ? 'مسؤول' : 'مستخدم'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-ultra-silver-muted text-xs">{new Date(u.created_at).toLocaleDateString('ar-SA')}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs ${u.status === 'active' ? 'bg-ultra-surface text-ultra-silver-bright' : 'bg-ultra-bg text-ultra-silver-dark'}`}>
                                                {u.status === 'active' ? 'نشط' : 'معلق'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1">
                                                {u.role === 'user' ? (
                                                    <button onClick={() => updateRole(u.id, 'admin')} title="ترقية إلى مسؤول" className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><Shield size={15} /></button>
                                                ) : (
                                                    <button onClick={() => updateRole(u.id, 'user')} title="إزالة صلاحية المسؤول" className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><ShieldOff size={15} /></button>
                                                )}
                                                {u.status === 'active' ? (
                                                    <button onClick={() => updateStatus(u.id, 'suspended')} title="تعليق" className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><UserX size={15} /></button>
                                                ) : (
                                                    <button onClick={() => updateStatus(u.id, 'active')} title="تفعيل" className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><UserCheck size={15} /></button>
                                                )}
                                                {/* Phone Actions */}
                                                {u.phone_number && !u.phone_verified && (
                                                    <>
                                                        <button onClick={() => manualVerifyPhone(u.id)} title="توثيق الرقم يدوياً" className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><CheckCircle size={15} /></button>
                                                        <button onClick={() => resendOTP(u.phone_number!)} title="إعادة إرسال رمز التحقق" className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><Send size={15} /></button>
                                                    </>
                                                )}
                                                <button onClick={() => deleteUser(u.id)} title="حذف" className="p-1.5 rounded-lg text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface transition-all"><Trash2 size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!loading && users.length === 0 && (
                <div className="text-center py-16"><p className="text-ultra-silver-muted">لا يوجد مستخدمون</p></div>
            )}
        </div>
    );
}
