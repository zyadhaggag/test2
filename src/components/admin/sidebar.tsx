'use client';

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

    return (
        <aside className="fixed bottom-0 left-0 right-0 sm:relative sm:w-20 sm:min-h-screen bg-ultra-sidebar border-t sm:border-t-0 sm:border-l border-ultra-border flex flex-row sm:flex-col z-50">
            <div className="hidden sm:flex p-4 border-b border-ultra-border justify-center items-center h-16">
                <h2 className="font-extrabold text-xl text-ultra-silver-bright">U</h2>
            </div>

            <nav className="flex-1 flex flex-row sm:flex-col items-center justify-around sm:justify-start p-2 sm:p-4 gap-1 sm:gap-4 overflow-x-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={item.label}
                            className={`
                flex items-center justify-center p-3 sm:p-3.5 rounded-xl transition-all duration-ultra min-w-[3rem]
                ${isActive
                                    ? 'bg-ultra-surface border border-ultra-border text-ultra-silver-bright shadow-glow'
                                    : 'text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface/50'
                                }
              `}
                        >
                            <item.icon size={22} className={isActive ? "fill-ultra-silver-bright/10" : ""} />
                        </Link>
                    );
                })}
            </nav>

            <div className="hidden sm:flex p-4 border-t border-ultra-border justify-center">
                <Link
                    href="/"
                    title="العودة"
                    className="flex items-center justify-center p-3 rounded-xl text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface/50 transition-all duration-ultra"
                >
                    <ArrowRight size={22} />
                </Link>
            </div>
        </aside>
    );
}
