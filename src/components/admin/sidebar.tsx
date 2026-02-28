'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    Wrench,
    FolderOpen,
    Tag,
    Image,
    ShoppingBag,
    Users,
    MessageCircle,
    ArrowRight,
    ChevronRight,
    ChevronLeft,
} from 'lucide-react';

const menuItems = [
    { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
    { href: '/admin/products', label: 'المنتجات', icon: Package },
    { href: '/admin/categories', label: 'الأقسام', icon: FolderOpen },
    { href: '/admin/offers', label: 'العروض', icon: Tag },
    { href: '/admin/hero-slides', label: 'السلايدر', icon: Image },
    { href: '/admin/orders', label: 'الطلبات', icon: ShoppingBag },
    { href: '/admin/users', label: 'المستخدمين', icon: Users },
    { href: '/admin/chat', label: 'المحادثات', icon: MessageCircle },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <aside
            className={`fixed bottom-0 left-0 right-0 sm:relative min-h-[60px] sm:min-h-screen bg-ultra-sidebar border-t sm:border-t-0 sm:border-l border-ultra-border flex flex-row sm:flex-col z-50 transition-all duration-300 ${isExpanded ? 'sm:w-64' : 'sm:w-20'}`}
        >
            <div className="hidden sm:flex p-4 border-b border-ultra-border justify-between items-center h-16">
                {isExpanded && <h2 className="font-extrabold text-xl text-ultra-silver-bright">ألترا أدمن</h2>}
                {!isExpanded && <h2 className="font-extrabold text-xl text-ultra-silver-bright mx-auto">U</h2>}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-ultra-silver-muted hover:text-white transition-colors"
                >
                    {isExpanded ? <ChevronRight size={20} /> : <ChevronLeft size={20} className="hidden" />}
                </button>
            </div>
            {/* Mobile Toggle Handle (optional, but we use desktop mainly for this expand feature) */}
            {!isExpanded && (
                <button
                    onClick={() => setIsExpanded(true)}
                    className="hidden sm:flex absolute -left-3 top-20 bg-ultra-surface border border-ultra-border rounded-full p-1 text-ultra-silver-muted hover:text-white z-50 transition-colors"
                >
                    <ChevronLeft size={14} />
                </button>
            )}

            <nav className="flex-1 flex flex-row sm:flex-col items-center sm:items-stretch justify-around sm:justify-start p-2 sm:p-4 gap-1 sm:gap-4 overflow-x-auto sm:overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={!isExpanded ? item.label : undefined}
                            className={`
                                flex items-center p-3 rounded-xl transition-all duration-ultra
                                ${isExpanded ? 'justify-start gap-4' : 'justify-center min-w-[3rem]'}
                                ${isActive
                                    ? 'bg-ultra-surface border border-ultra-border text-ultra-silver-bright shadow-glow'
                                    : 'text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface/50 border border-transparent'
                                }
                            `}
                        >
                            <item.icon size={22} className={isActive ? "fill-ultra-silver-bright/10 shrink-0" : "shrink-0"} />
                            {isExpanded && (
                                <span className="hidden sm:block font-bold whitespace-nowrap">{item.label}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className={`hidden sm:flex p-4 border-t border-ultra-border ${isExpanded ? 'justify-start' : 'justify-center'}`}>
                <Link
                    href="/"
                    title={!isExpanded ? "العودة للموقع" : undefined}
                    className={`flex items-center p-3 rounded-xl text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface/50 transition-all duration-ultra border border-transparent ${isExpanded ? 'justify-start gap-4 w-full' : 'justify-center w-full'}`}
                >
                    <ArrowRight size={22} className="shrink-0" />
                    {isExpanded && <span className="font-bold whitespace-nowrap">العودة للموقع</span>}
                </Link>
            </div>
        </aside>
    );
}
