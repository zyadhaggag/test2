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
                                <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-ultra-surface border border-ultra-border flex items-center justify-center text-ultra-silver-muted hover:text-white hover:border-ultra-silver-bright hover:bg-ultra-border transition-all">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                                </a>
                                <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-ultra-surface border border-ultra-border flex items-center justify-center text-ultra-silver-muted hover:text-white hover:border-ultra-silver-bright hover:bg-ultra-border transition-all">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                </a>
                                <a href="#" aria-label="WhatsApp" className="w-9 h-9 rounded-full bg-ultra-surface border border-ultra-border flex items-center justify-center text-ultra-silver-muted hover:text-white hover:border-ultra-silver-bright hover:bg-ultra-border transition-all">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile View (Extremely Minimal) */}
                <div className="flex sm:hidden flex-col items-center justify-center space-y-4">
                    <Image src="/imgs/logo/logo.png" alt="ULTRA" width={120} height={40} className="h-10 w-auto object-contain" />
                    <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-ultra-silver-muted">
                        <Link href="/products" className="hover:text-ultra-silver-bright transition-colors">المنتجات</Link>
                        <span>•</span>
                        <Link href="/auth/login" className="hover:text-ultra-silver-bright transition-colors">تسجيل الدخول</Link>
                        <span>•</span>
                        <Link href="/contact" className="hover:text-ultra-silver-bright transition-colors">تواصل معنا</Link>
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
