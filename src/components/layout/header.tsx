'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X, User, ShoppingCart, Home, Gamepad2, Code, Palette, Dumbbell, Gift, Tag, LogIn, LogOut, LayoutDashboard, MessageCircle, Search, Heart } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { useChatStore } from '@/stores/chat-store';
import { useFavoritesStore } from '@/stores/favorites-store';
import { useTranslation } from '@/stores/dialect-store';
import { useRouter } from 'next/navigation';

import { useFavoritesModalStore } from '@/stores/favorites-modal-store';

export function Header() {
    const { t } = useTranslation();
    const router = useRouter();

    const drawerLinks = [
        { href: '/', label: t('home'), icon: Home },
        { href: '/category/games', label: 'ألعاب وحسابات', icon: Gamepad2 },
        { href: '/category/programming', label: 'برمجة', icon: Code },
        { href: '/category/design', label: 'تصاميم', icon: Palette },
        { href: '/category/sports', label: 'رياضة', icon: Dumbbell },
        { href: '/category/free', label: 'مجاني من ألترا', icon: Gift },
    ];
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, isAuthenticated, initialize, signOut } = useAuthStore();
    const cartItemCount = useCartStore((s) => s.getItemCount());
    const openChat = useChatStore((s) => s.openChat);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const fetchFavorites = useFavoritesStore(s => s.fetchFavorites);
    const clearFavorites = useFavoritesStore(s => s.clearFavorites);
    const openFavorites = useFavoritesModalStore(s => s.openModal);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchOpen(false);
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut();
        setIsLoggingOut(false);
        setDrawerOpen(false);
    };

    useEffect(() => {
        setIsMounted(true);
        initialize();
    }, [initialize]);

    useEffect(() => {
        if (user?.id) {
            fetchFavorites(user.id);
        } else {
            clearFavorites();
        }
    }, [user?.id, fetchFavorites, clearFavorites]);

    // Close drawer on Escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setDrawerOpen(false);
                setSearchOpen(false);
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, []);

    // Prevent scroll when drawer or search open
    useEffect(() => {
        if (drawerOpen || searchOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [drawerOpen, searchOpen]);

    return (
        <>
            {/* Mobile Header - Visible only on mobile */}
            <header className="sm:hidden sticky top-0 z-50 glass-strong flex items-center justify-between px-4 py-3 shadow-ultra">
                {/* Right: Hamburger */}
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="p-2 text-ultra-silver-muted hover:text-white transition-colors"
                    aria-label="القائمة"
                >
                    <Menu size={24} />
                </button>

                {/* Center: Logo */}
                <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                    <Image src="/imgs/logo/logo.png" alt="ULTRA" width={140} height={40} className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" priority={true} />
                </Link>

                {/* Left: Actions */}
                <div className="flex items-center gap-0.5">
                    <button
                        onClick={() => setSearchOpen(true)}
                        className="p-1.5 text-ultra-silver-muted hover:text-white transition-colors"
                        aria-label="البحث"
                    >
                        <Search size={20} />
                    </button>
                    <button onClick={openFavorites} className="p-1.5 text-ultra-silver-muted hover:text-white transition-colors" aria-label="المفضلة">
                        <Heart size={20} />
                    </button>
                    {isAuthenticated && user?.role === 'admin' && (
                        <Link href="/admin" className="p-1.5 text-ultra-silver-muted hover:text-white transition-colors">
                            <LayoutDashboard size={20} />
                        </Link>
                    )}
                </div>
            </header>

            {/* Header Bar - Hidden on mobile, visible on sm and up */}
            <header className="hidden sm:block sticky top-0 z-50 glass-strong py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* LEFT: Hamburger */}
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="p-2 text-ultra-silver-muted hover:text-ultra-silver-bright transition-colors duration-ultra"
                            aria-label="القائمة"
                        >
                            <Menu size={22} />
                        </button>

                        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                            <Image src="/imgs/logo/logo.png" alt="ULTRA" width={240} height={80} className="h-20 w-auto object-contain" priority={true} />
                        </Link>

                        {/* RIGHT: Login + Basket */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSearchOpen(true)}
                                className="p-2 text-ultra-silver-muted hover:text-ultra-silver-bright transition-colors duration-ultra"
                                title="البحث"
                            >
                                <Search size={22} />
                            </button>
                            <button
                                onClick={openFavorites}
                                className="p-2 text-ultra-silver-muted hover:text-ultra-silver-bright transition-colors duration-ultra"
                                title={t('favorites')}
                            >
                                <Heart size={22} />
                            </button>
                            {isAuthenticated && (
                                <button
                                    onClick={openChat}
                                    className="p-2 text-ultra-silver-muted hover:text-ultra-silver-bright transition-colors duration-ultra"
                                    title="الدعم"
                                >
                                    <MessageCircle size={20} />
                                </button>
                            )}

                            {isAuthenticated && user?.role === 'admin' && (
                                <Link href="/admin" className="p-2 text-ultra-silver-muted hover:text-ultra-silver-bright transition-colors duration-ultra" title="لوحة التحكم">
                                    <LayoutDashboard size={20} />
                                </Link>
                            )}

                            {!isAuthenticated && (
                                <Link href="/auth/login" className="p-2 text-ultra-silver-muted hover:text-ultra-silver-bright transition-colors duration-ultra" title={t('login')}>
                                    <User size={20} />
                                </Link>
                            )}

                            <Link
                                href="/cart"
                                className="relative p-2 text-ultra-silver-muted hover:text-ultra-silver-bright transition-colors duration-ultra"
                                title={t('cart')}
                            >
                                <ShoppingCart size={22} className="text-ultra-silver-muted group-hover:text-white transition-colors" />
                                {isMounted && cartItemCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-ultra-silver-bright border border-ultra-bg shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Overlay */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md transition-all duration-300"
                    onClick={() => setDrawerOpen(false)}
                />
            )}

            {/* Drawer */}
            <aside
                className={`fixed top-0 right-0 z-[70] h-full w-72 bg-ultra-bg-secondary border-l border-ultra-border shadow-ultra transform transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between px-5 h-20 border-b border-ultra-border relative">
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <Image src="/imgs/logo/logo.png" alt="ULTRA" width={140} height={40} className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                    </div>
                    <div />
                    <button
                        onClick={() => setDrawerOpen(false)}
                        className="p-2 text-ultra-silver-muted hover:text-ultra-silver-bright transition-colors sm:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Drawer Links */}
                <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-64px-80px)]">
                    {drawerLinks.map((link, i) => (
                        <Link
                            key={i}
                            href={link.href}
                            onClick={() => setDrawerOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface rounded-xl transition-all duration-ultra group"
                        >
                            <link.icon size={18} className="group-hover:scale-110 transition-transform" />
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Drawer Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-ultra-border bg-ultra-bg-secondary">
                    {isAuthenticated ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 px-4 py-2">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-ultra-border/50 bg-ultra-surface flex-shrink-0">
                                    <Image src="/usr.jpg" alt={user?.full_name || 'User'} fill className="object-cover rounded-full" unoptimized />
                                </div>
                                <span className="text-sm text-ultra-silver-bright font-medium truncate">{user?.full_name || 'مستخدم ألترا'}</span>
                            </div>
                            {user?.role === 'admin' && (
                                <Link
                                    href="/admin"
                                    onClick={() => setDrawerOpen(false)}
                                    className="hidden sm:flex items-center gap-3 px-4 py-2.5 text-sm text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface rounded-xl transition-all"
                                >
                                    <LayoutDashboard size={18} />
                                    لوحة التحكم
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-ultra-silver-muted hover:text-ultra-silver-bright hover:bg-ultra-surface rounded-xl transition-all"
                            >
                                {isLoggingOut ? (
                                    <div className="w-[18px] h-[18px] rounded-full border-t-2 border-ultra-silver-bright animate-spin shrink-0"></div>
                                ) : (
                                    <LogOut size={18} />
                                )}
                                {t('logout')}
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/auth/login"
                            onClick={() => setDrawerOpen(false)}
                            className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold bg-ultra-surface border border-ultra-border text-ultra-silver-bright rounded-xl hover:bg-ultra-card hover:shadow-glow transition-all duration-ultra"
                        >
                            <LogIn size={18} />
                            {t('login')}
                        </Link>
                    )}
                </div>
            </aside>

            {/* Search Overlay */}
            {searchOpen && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease]">
                    <div className="max-w-4xl mx-auto px-4 pt-32 pb-8">
                        <div className="relative flex items-center">
                            <form onSubmit={handleSearchSubmit} className="w-full">
                                <div className="flex bg-ultra-bg-secondary border border-ultra-border overflow-hidden rounded-2xl w-full">
                                    <input
                                        type="text"
                                        placeholder={t('search')}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-transparent border-none outline-none text-white px-4 py-3 text-sm placeholder:text-ultra-silver-muted"
                                        autoFocus
                                    />
                                    <button type="submit" className="px-4 text-ultra-silver-muted hover:text-white transition-colors">
                                        <Search size={20} />
                                    </button>
                                </div>
                            </form>
                            <button
                                onClick={() => setSearchOpen(false)}
                                className="absolute left-4 p-2 text-ultra-silver-muted hover:text-white transition-colors bg-ultra-bg rounded-xl"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        {searchQuery && (
                            <div className="mt-8 text-center animate-[fadeIn_0.3s_ease]">
                                <Link
                                    href={`/products?q=${encodeURIComponent(searchQuery)}`}
                                    onClick={() => setSearchOpen(false)}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-ultra-silver-bright text-ultra-bg font-extrabold rounded-xl hover:bg-white transition-all shadow-glow text-lg"
                                >
                                    عرض النتائج لـ &quot;{searchQuery}&quot;
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
