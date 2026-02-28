import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { SidebarChat } from '@/components/layout/sidebar-chat';
import { HomeContent } from './home-content';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // The `set` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch (error) {
                        // The `remove` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    );

    const [slidesRes, productsRes] = await Promise.all([
        supabase.from('hero_slides').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('products').select('*, category:categories(*)').eq('status', 'active').limit(50),
    ]);

    const initialSlides = slidesRes.data || [];
    const initialProducts = productsRes.data || [];

    return (
        <>
            <Header />
            <main className="min-h-screen">
                <HomeContent initialSlides={initialSlides} initialProducts={initialProducts} />
            </main>
            <Footer />
            <SidebarChat />
        </>
    );
}
