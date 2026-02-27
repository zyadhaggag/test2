import { AdminSidebar } from '@/components/admin/sidebar';
import Link from 'next/link';
import { Store } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-ultra-bg">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <header className="h-16 border-b border-ultra-border bg-ultra-bg-secondary flex items-center justify-between px-6 shrink-0">
                    <h1 className=" font-bold text-ultra-silver-bright">لوحة الإدارة</h1>
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium text-ultra-silver-muted hover:text-ultra-silver-bright transition-colors">
                        العودة للمتجر
                        <Store size={18} />
                    </Link>
                </header>
                <main className="flex-1 p-4 sm:p-6 overflow-y-auto pb-24 sm:pb-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
