import Link from 'next/link';
import Image from 'next/image';
import { Home, Package, MapPin, Search } from 'lucide-react';

export function Footer() {
    return (
        <footer className="relative bg-ultra-bg-secondary border-t border-ultra-border mt-16 overflow-hidden pb-safe mb-16 sm:mb-0">
            {/* Subtle glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-ultra-silver-dark/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 relative z-10">
                {/* Desktop and Tablet View */}
                <div className="hidden sm:flex flex-col md:flex-row items-center justify-between gap-12">
                    {/* Brand */}
                    <div className="flex flex-col items-center md:items-start space-y-6 text-center md:text-right md:w-1/3">
                        <Image src="/imgs/logo/logo.png" alt="ULTRA" width={160} height={54} className="h-14 w-auto object-contain" />
                        <p className="text-sm text-ultra-silver-muted leading-relaxed max-w-sm">
                            وجهتك المميزة للمنتجات والخدمات الحصرية بأعلى مستويات الجودة والموثوقية.
                        </p>
                    </div>

                    {/* Links Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 md:w-2/3 w-full text-center md:text-right">
                        <div className="space-y-5">
                            <h4 className=" font-bold text-ultra-silver-bright">روابط سريعة</h4>
                            <div className="flex flex-col gap-3">
                                <Link href="/products" className="text-sm text-ultra-silver-muted hover:text-white hover:-translate-y-0.5 transition-all duration-ultra">المنتجات</Link>
                                <Link href="/services" className="text-sm text-ultra-silver-muted hover:text-white hover:-translate-y-0.5 transition-all duration-ultra">الخدمات</Link>
                                <Link href="/categories" className="text-sm text-ultra-silver-muted hover:text-white hover:-translate-y-0.5 transition-all duration-ultra">الأقسام</Link>
                                <Link href="/offers" className="text-sm text-ultra-silver-muted hover:text-white hover:-translate-y-0.5 transition-all duration-ultra">العروض</Link>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <h4 className=" font-bold text-ultra-silver-bright">الحساب</h4>
                            <div className="flex flex-col gap-3">
                                <Link href="/auth/login" className="text-sm text-ultra-silver-muted hover:text-white hover:-translate-y-0.5 transition-all duration-ultra">تسجيل الدخول</Link>
                                <Link href="/auth/register" className="text-sm text-ultra-silver-muted hover:text-white hover:-translate-y-0.5 transition-all duration-ultra">إنشاء حساب</Link>
                            </div>
                        </div>

                        <div className="space-y-4 col-span-2 sm:col-span-1 border-t sm:border-t-0 border-ultra-border pt-6 sm:pt-0">
                            <h4 className=" font-bold text-ultra-silver-bright">تواصل معنا</h4>
                            <div className="flex flex-col gap-3">
                                <a href="mailto:support@ultrastore.com" className="text-sm text-ultra-silver-muted hover:text-white transition-colors w-fit">support@ultrastore.com</a>
                                <a href="tel:+966500000000" className="text-sm text-ultra-silver-muted hover:text-white transition-colors dir-ltr text-right inline-block w-fit font-mono">+966 50 000 0000</a>
                            </div>
                            <div className="flex items-center justify-center md:justify-end gap-3 mt-6">
                                <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok" className="w-10 h-10 rounded-full bg-ultra-surface border border-ultra-border flex items-center justify-center text-ultra-silver-muted hover:text-white hover:border-ultra-silver-bright hover:bg-ultra-silver-bright/10 transition-all duration-ultra hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" /></svg>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-ultra-surface border border-ultra-border flex items-center justify-center text-ultra-silver-muted hover:text-white hover:border-ultra-silver-bright hover:bg-ultra-silver-bright/10 transition-all duration-ultra hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                </a>
                                <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full bg-ultra-surface border border-ultra-border flex items-center justify-center text-ultra-silver-muted hover:text-white hover:border-ultra-silver-bright hover:bg-ultra-silver-bright/10 transition-all duration-ultra hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z" /></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile View (Extremely Minimal) */}
                <div className="flex sm:hidden flex-col items-center justify-center space-y-6">
                    <Image src="/imgs/logo/logo.png" alt="ULTRA" width={120} height={40} className="h-10 w-auto object-contain" />
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-ultra-silver-muted">
                        <Link href="/products" className="hover:text-white transition-colors">المنتجات</Link>
                        <span>•</span>
                        <Link href="/auth/login" className="hover:text-white transition-colors">تسجيل الدخول</Link>
                        <span>•</span>
                        <Link href="/contact" className="hover:text-white transition-colors">تواصل معنا</Link>
                    </div>
                    {/* Mobile Social Icons */}
                    <div className="flex items-center justify-center gap-4">
                        <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok" className="w-10 h-10 rounded-full bg-ultra-surface border border-ultra-border flex items-center justify-center text-ultra-silver-muted hover:text-white hover:border-ultra-silver-bright transition-all duration-ultra">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" /></svg>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-ultra-surface border border-ultra-border flex items-center justify-center text-ultra-silver-muted hover:text-white hover:border-ultra-silver-bright transition-all duration-ultra">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full bg-ultra-surface border border-ultra-border flex items-center justify-center text-ultra-silver-muted hover:text-white hover:border-ultra-silver-bright transition-all duration-ultra">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33zM9.75 15.02V8.48l5.75 3.27-5.75 3.27z" /></svg>
                        </a>
                    </div>
                </div>

                <div className="border-t border-ultra-border mt-8 sm:mt-16 pt-8 flex items-center justify-center text-center">
                    <p className="text-xs text-ultra-silver-dark max-w-[250px] sm:max-w-none mx-auto leading-relaxed">
                        جميع الحقوق محفوظة لـ <span className="text-transparent bg-clip-text bg-gradient-to-r from-ultra-silver-muted to-white font-bold ml-1">ULTRA</span>
                        <br className="sm:hidden" /> {new Date().getFullYear()} ©
                    </p>
                </div>
            </div>
        </footer>
    );
}
