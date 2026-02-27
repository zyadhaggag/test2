import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SidebarChat } from '@/components/layout/sidebar-chat';
import { HomeContent } from './home-content';

export const dynamic = 'force-dynamic';

export default function HomePage() {
    return (
        <>
            <Header />
            <main className="min-h-screen">
                <HomeContent />
            </main>
            <Footer />
            <SidebarChat />
        </>
    );
}
