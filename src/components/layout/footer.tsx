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

                        <div className="space-y-5 col-span-2 sm:col-span-1">
                            <h4 className=" font-bold text-ultra-silver-bright">تواصل معنا</h4>
                            <p className="text-sm text-ultra-silver-muted leading-relaxed">
                                نحن هنا لمساعدتك دائماً.
                            </p>
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
