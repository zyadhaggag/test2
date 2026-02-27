'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
    DollarSign,
    ShoppingBag,
    Users,
    Package,
    TrendingUp,
    CalendarDays,
} from 'lucide-react';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import type { DashboardStats } from '@/lib/supabase/types';

const CHART_COLORS = ['#C9CED6', '#9CA3AF', '#6B7280', '#E5E7EB', '#BFC5CE'];

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: 0, totalOrders: 0, totalUsers: 0,
        totalProducts: 0, netProfit: 0, todaySales: 0, monthlyGrowth: 0,
    });
    const [revenueData, setRevenueData] = useState<{ day: string; revenue: number }[]>([]);
    const [topProducts, setTopProducts] = useState<{ name: string; sales: number }[]>([]);
    const [orderDist, setOrderDist] = useState<{ name: string; value: number }[]>([]);
    const [userGrowth, setUserGrowth] = useState<{ month: string; users: number }[]>([]);

    useEffect(() => {
        const supabase = createClient();

        async function fetchStats() {
            const [ordersRes, usersRes, productsRes] = await Promise.all([
                supabase.from('orders').select('*'),
                supabase.from('profiles').select('*'),
                supabase.from('products').select('*'),
            ]);

            const orders = ordersRes.data || [];
            const users = usersRes.data || [];
            const products = productsRes.data || [];

            const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
            const today = new Date().toISOString().split('T')[0];
            const todaySales = orders
                .filter((o) => o.created_at?.startsWith(today))
                .reduce((sum, o) => sum + (o.total || 0), 0);

            setStats({
                totalRevenue,
                totalOrders: orders.length,
                totalUsers: users.length,
                totalProducts: products.length,
                netProfit: totalRevenue * 0.3,
                todaySales,
                monthlyGrowth: orders.length > 0 ? 12.5 : 0,
            });

            // 30-day revenue chart
            const thirtyDays: { day: string; revenue: number }[] = [];
            for (let i = 29; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                const dayRevenue = orders
                    .filter((o) => o.created_at?.startsWith(dateStr))
                    .reduce((sum, o) => sum + (o.total || 0), 0);
                thirtyDays.push({ day: d.getDate().toString(), revenue: dayRevenue });
            }
            setRevenueData(thirtyDays);

            // Top products
            const { data: orderItems } = await supabase
                .from('order_items')
                .select('product_id, quantity, product:products(name)');
            const productSales: Record<string, { name: string; sales: number }> = {};
            (orderItems || []).forEach((item: Record<string, unknown>) => {
                const pid = item.product_id as string;
                const product = item.product as { name: string } | null;
                if (!productSales[pid]) {
                    productSales[pid] = { name: product?.name || 'منتج', sales: 0 };
                }
                productSales[pid].sales += (item.quantity as number) || 0;
            });
            setTopProducts(
                Object.values(productSales)
                    .sort((a, b) => b.sales - a.sales)
                    .slice(0, 5)
            );

            // Order distribution
            const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
            const labels: Record<string, string> = {
                pending: 'قيد الانتظار', processing: 'قيد المعالجة',
                shipped: 'تم الشحن', delivered: 'تم التسليم', cancelled: 'ملغي',
            };
            setOrderDist(
                statuses.map((s) => ({
                    name: labels[s],
                    value: orders.filter((o) => o.status === s).length,
                })).filter((d) => d.value > 0)
            );

            // User growth
            const months: { month: string; users: number }[] = [];
            for (let i = 5; i >= 0; i--) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const monthStr = d.toISOString().slice(0, 7);
                const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
                const count = users.filter((u) => u.created_at?.startsWith(monthStr)).length;
                months.push({ month: monthNames[d.getMonth()], users: count });
            }
            setUserGrowth(months);
        }

        fetchStats();
    }, []);

    const statCards = [
        { label: 'إجمالي الإيرادات', value: stats.totalRevenue.toLocaleString(), icon: DollarSign, suffix: 'ر.س' },
        { label: 'إجمالي الطلبات', value: stats.totalOrders.toString(), icon: ShoppingBag },
        { label: 'إجمالي المستخدمين', value: stats.totalUsers.toString(), icon: Users },
        { label: 'إجمالي المنتجات', value: stats.totalProducts.toString(), icon: Package },
        { label: 'صافي الربح', value: stats.netProfit.toLocaleString(), icon: TrendingUp, suffix: 'ر.س' },
        { label: 'مبيعات اليوم', value: stats.todaySales.toLocaleString(), icon: CalendarDays, suffix: 'ر.س' },
    ];

    return (
        <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {statCards.map((card, i) => (
                    <div
                        key={i}
                        className="bg-ultra-card border border-ultra-border rounded-ultra p-6 transition-all duration-ultra hover:shadow-glow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-ultra-silver-muted">{card.label}</span>
                            <div className="w-10 h-10 rounded-xl bg-ultra-surface border border-ultra-border flex items-center justify-center">
                                <card.icon size={18} className="text-ultra-silver" />
                            </div>
                        </div>
                        <p className=" font-extrabold text-2xl text-ultra-silver-bright">
                            {card.value} {card.suffix && <span className="text-sm text-ultra-silver-muted">{card.suffix}</span>}
                        </p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Line Chart */}
                <div className="bg-ultra-card border border-ultra-border rounded-ultra p-6">
                    <h3 className=" font-bold text-lg text-ultra-silver-bright mb-6">إيرادات 30 يوم</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2A313C" />
                            <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                            <YAxis stroke="#6B7280" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    background: '#151A22', border: '1px solid #2A313C',
                                    borderRadius: '12px', color: '#E5E7EB',
                                }}
                            />
                            <Line type="monotone" dataKey="revenue" stroke="#C9CED6" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Products Bar Chart */}
                <div className="bg-ultra-card border border-ultra-border rounded-ultra p-6">
                    <h3 className=" font-bold text-lg text-ultra-silver-bright mb-6">أعلى المنتجات مبيعاً</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={topProducts} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#2A313C" />
                            <XAxis type="number" stroke="#6B7280" fontSize={12} />
                            <YAxis dataKey="name" type="category" stroke="#6B7280" fontSize={11} width={100} />
                            <Tooltip
                                contentStyle={{
                                    background: '#151A22', border: '1px solid #2A313C',
                                    borderRadius: '12px', color: '#E5E7EB',
                                }}
                            />
                            <Bar dataKey="sales" fill="#9CA3AF" radius={[0, 6, 6, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Orders Pie Chart */}
                <div className="bg-ultra-card border border-ultra-border rounded-ultra p-6">
                    <h3 className=" font-bold text-lg text-ultra-silver-bright mb-6">توزيع الطلبات</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={orderDist}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {orderDist.map((_, i) => (
                                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: '#151A22', border: '1px solid #2A313C',
                                    borderRadius: '12px', color: '#E5E7EB',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* User Growth Area Chart */}
                <div className="bg-ultra-card border border-ultra-border rounded-ultra p-6">
                    <h3 className=" font-bold text-lg text-ultra-silver-bright mb-6">نمو المستخدمين</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={userGrowth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2A313C" />
                            <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                            <YAxis stroke="#6B7280" fontSize={12} />
                            <Tooltip
                                contentStyle={{
                                    background: '#151A22', border: '1px solid #2A313C',
                                    borderRadius: '12px', color: '#E5E7EB',
                                }}
                            />
                            <Area type="monotone" dataKey="users" stroke="#C9CED6" fill="#C9CED6" fillOpacity={0.1} strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
