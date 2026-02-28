import type { Metadata } from 'next';
import './globals.css';
import { NotificationProvider } from '@/components/ui/notification-provider';
import { GlobalLoading } from '@/components/ui/global-loading';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { SidebarChat } from '@/components/layout/sidebar-chat';
import { ScrollToTop } from '@/components/layout/scroll-to-top';

export const metadata: Metadata = {
    title: {
        template: '%s | ألترا ستور',
        default: 'ألترا ستور | الرئيسية',
    },
    description: 'ألترا - وجهتك المميزة للمنتجات والخدمات الحصرية بأنسب الأسعار',
    keywords: ['ultra', 'store', 'premium', 'luxury', 'shopping'],
    icons: {
        icon: '/top.svg',
    },
    openGraph: {
        title: 'ألترا ستور | الوجهة الرقمية الأولى',
        description: 'ألترا - وجهتك المميزة للمنتجات والخدمات الحصرية بأنسب الأسعار',
        url: 'https://ultra-store1.vercel.app',
        siteName: 'ألترا ستور',
        images: [
            {
                url: '/imgs/logo/logo.png',
                width: 800,
                height: 600,
                alt: 'شعار ألترا ستور',
            },
        ],
        locale: 'ar_SA',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ألترا ستور | الوجهة الرقمية الأولى',
        description: 'ألترا - وجهتك المميزة للمنتجات والخدمات الحصرية بأنسب الأسعار',
        images: ['/imgs/logo/logo.png'],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ar" dir="rtl">
            <body className="font-tajawal bg-ultra-bg text-ultra-silver min-h-screen">
                <ScrollToTop />
                <GlobalLoading />
                <NotificationProvider />
                <SidebarChat />
                {children}
                <MobileBottomNav />
            </body>
        </html>
    );
}
