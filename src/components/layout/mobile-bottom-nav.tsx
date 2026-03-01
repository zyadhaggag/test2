'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, ShoppingCart, User, LayoutDashboard } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useAuthStore } from '@/stores/auth-store';
import { useTranslation } from '@/stores/dialect-store';
import { useState, useEffect } from 'react';

export function MobileBottomNav() {
    const pathname = usePathname();
    const { isAuthenticated, user } = useAuthStore();
    const { t } = useTranslation();
    const cartItemCount = useCartStore((s) => s.getItemCount());
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Hide if admin or auth route
    if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) {
        return null;
    }

    const navItems = [
        {
            href: '/',
            icon: Home,
            label: t('home'),
            isActive: pathname === '/'
        },
        {
            href: '/categories',
            icon: Grid,
            label: 'الأقسام',
            isActive: pathname.startsWith('/category') || pathname === '/categories'
        },
        {
            href: '/cart',
            icon: ShoppingCart,
            label: t('cart'),
            isActive: pathname === '/cart',
            badge: isMounted && cartItemCount > 0 ? true : false
        },
        {
            href: isAuthenticated ? '/profile' : '/auth/login',
            icon: User,
            label: t('profile'),
            isActive: pathname === '/profile' || pathname.startsWith('/auth')
        },
        ...(user?.role === 'admin' ? [{
            href: '/admin',
            icon: LayoutDashboard,
            label: 'الإدارة',
            isActive: false
        }] : [])
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden glass pb-safe">
            <nav className="flex items-center justify-around h-16">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-ultra ${item.isActive ? 'text-ultra-silver-bright' : 'text-ultra-silver-dark hover:text-ultra-silver-muted'
                            }`}
                    >
                        <item.icon size={20} className={item.isActive ? 'fill-ultra-silver-bright/10' : ''} />
                        <span className="text-[10px] font-medium">{item.label}</span>

                        {item.badge && (
                            <span className="absolute top-2 right-1/4 w-2 h-2 rounded-full bg-ultra-silver-bright border border-ultra-bg shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                        )}
                    </Link>
                ))}
            </nav>
        </div>
    );
}
