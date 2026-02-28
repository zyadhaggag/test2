'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { HeroSlider } from '@/components/layout/hero-slider';
import { ProductCard } from '@/components/ui/product-card';
import { ServiceCard } from '@/components/ui/service-card';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, ChevronLeft, Zap, Shield, Headphones, X } from 'lucide-react';
import type { Product, Service, HeroSlide, Category, Offer } from '@/lib/supabase/types';
import Image from 'next/image';

export function HomeContent({
    initialSlides = [],
    initialProducts = []
}: {
    initialSlides?: HeroSlide[],
    initialProducts?: Product[]
}) {
    const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const testimonialsRef = useRef<HTMLDivElement>(null);
    const isTestimonialsHovered = useRef(false);

    // Auto-scroll logic for testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            if (isTestimonialsHovered.current) return;
            const slider = testimonialsRef.current;
            if (slider) {
                const { scrollLeft, scrollWidth, clientWidth } = slider;
                // Since RTL, scrollLeft <= 0. We take absolute to check bounds
                if (Math.abs(scrollLeft) >= scrollWidth - clientWidth - 10) {
                    slider.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    slider.scrollBy({ left: -300, behavior: 'smooth' });
                }
            }
        }, 2200); // Slower speed
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const supabase = createClient();

        async function fetchLatestData() {
            const [slidesRes, productsRes] = await Promise.all([
                supabase.from('hero_slides').select('*').eq('is_active', true).order('sort_order'),
                supabase.from('products').select('*, category:categories(*)').eq('status', 'active').limit(50),
            ]);

            if (slidesRes.data) setSlides(slidesRes.data);
            if (productsRes.data) setProducts(productsRes.data);
        }

        // Realtime subscription for products
        const channel = supabase
            .channel('home-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
                fetchLatestData();
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'hero_slides' }, () => {
                fetchLatestData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="py-4 sm:py-6 space-y-12 sm:space-y-20 w-full px-0 sm:px-0 overflow-x-hidden">
            {/* Hero Slider */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
                <HeroSlider slides={slides} />
            </section>

            {/* Featured Products */}
            <ProductSlider title="اخترنا لك" desc="أفضل الخيارات" products={products.filter(p => p.is_featured)} link="/products" />

            {/* Programming Products */}
            <ProductSlider title="البرمجة" desc="تطوير واحتراف" products={products.filter(p => p.category?.name === 'البرمجة' || p.category?.name?.includes('برمجة'))} link="/category/programming" />

            {/* Design Products */}
            <ProductSlider title="التصاميم" desc="إبداع وتميز" products={products.filter(p => p.category?.name === 'التصاميم' || p.category?.name?.includes('تصاميم'))} link="/category/design" />

            {/* Banner Ads */}
            <section className="w-full relative min-h-[150px] sm:min-h-[400px] bg-ultra-bg-secondary cursor-pointer group flex items-center justify-center my-6" onClick={() => setIsModalOpen(true)}>
                <Image src="/ads.png" alt="إعلان" width={1200} height={400} className="w-full h-auto object-contain transition-transform group-hover:scale-[1.02] duration-ultra px-4 sm:px-6" unoptimized />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-ultra m-4 sm:m-6 rounded-2xl">
                    <span className="px-6 py-3 bg-ultra-surface text-ultra-silver-bright font-bold rounded-xl shadow-glow">انضم كمسوق الآن</span>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 py-10">
                <div className="text-center space-y-4">
                    <h2 className=" font-bold text-3xl sm:text-4xl text-ultra-silver-bright">لماذا تختار <span className="text-transparent bg-clip-text bg-gradient-to-r from-ultra-silver-muted to-white">ألترا</span>؟</h2>
                    <p className="text-ultra-silver-muted max-w-2xl mx-auto text-lg">نحن نقدم أفضل المنتجات والخدمات الرقمية بأعلى جودة لضمان نجاح أعمالك</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center items-center sm:items-start gap-12 sm:gap-20 pb-8 text-center" dir="rtl">
                    <div className="flex flex-col items-center group relative w-full sm:w-1/3">
                        <div className="relative w-20 h-20 mb-6 bg-ultra-surface rounded-2xl flex items-center justify-center border border-ultra-border group-hover:border-ultra-silver-muted/50 transition-colors shadow-ultra">
                            <Zap className="text-ultra-silver-bright group-hover:scale-110 transition-transform duration-ultra" size={32} />
                        </div>
                        <h3 className="font-bold text-xl text-ultra-silver-bright mb-3 group-hover:text-white transition-colors">سرعة الإنجاز</h3>
                        <p className="text-ultra-silver-muted text-sm leading-relaxed max-w-[250px]">تنفيذ سريع لجميع طلباتك مع الحفاظ على أعلى معايير الجودة والإتقان.</p>
                    </div>
                    <div className="flex flex-col items-center group relative w-full sm:w-1/3">
                        <div className="relative w-20 h-20 mb-6 bg-ultra-surface rounded-2xl flex items-center justify-center border border-ultra-border group-hover:border-ultra-silver-muted/50 transition-colors shadow-ultra">
                            <Shield className="text-ultra-silver-bright group-hover:scale-110 transition-transform duration-ultra" size={32} />
                        </div>
                        <h3 className="font-bold text-xl text-ultra-silver-bright mb-3 group-hover:text-white transition-colors">جودة وضمان</h3>
                        <p className="text-ultra-silver-muted text-sm leading-relaxed max-w-[250px]">نضمن لك الحصول على منتجات برمجية وتصاميم خالية من الأخطاء بكفاءة عالية.</p>
                    </div>
                    <div className="flex flex-col items-center group relative w-full sm:w-1/3">
                        <div className="relative w-20 h-20 mb-6 bg-ultra-surface rounded-2xl flex items-center justify-center border border-ultra-border group-hover:border-ultra-silver-muted/50 transition-colors shadow-ultra">
                            <Headphones className="text-ultra-silver-bright group-hover:scale-110 transition-transform duration-ultra" size={32} />
                        </div>
                        <h3 className="font-bold text-xl text-ultra-silver-bright mb-3 group-hover:text-white transition-colors">دعم متواصل</h3>
                        <p className="text-ultra-silver-muted text-sm leading-relaxed max-w-[250px]">فريق دعم فني لخدمتك في أي وقت، متواجد دائماً للإجابة على استفساراتك.</p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 pb-20">
                <div className="text-center space-y-4">
                    <h2 className=" font-bold text-3xl sm:text-4xl text-ultra-silver-bright">آراء <span className="text-transparent bg-clip-text bg-gradient-to-r from-ultra-silver-muted to-white">عملائنا</span></h2>
                    <p className="text-ultra-silver-muted max-w-2xl mx-auto text-lg">نفخر بثقة عملائنا وشركاء نجاحنا</p>
                </div>
                <div
                    id="testimonials-slider"
                    ref={testimonialsRef}
                    onMouseEnter={() => isTestimonialsHovered.current = true}
                    onMouseLeave={() => isTestimonialsHovered.current = false}
                    onTouchStart={() => isTestimonialsHovered.current = true}
                    onTouchEnd={() => isTestimonialsHovered.current = false}
                    className="flex overflow-x-auto gap-6 snap-x snap-mandatory scroll-smooth custom-scrollbar pb-8 -mx-4 px-4 sm:mx-0 sm:px-0" dir="rtl"
                >
                    {[
                        { name: 'أحمد عبدالله', text: 'تجربة ممتازة مع متجر ألترا، التصاميم احترافية والتسليم في الموعد المحدد.' },
                        { name: 'سارة خالد', text: 'أفضل مكان للحصول على خدمات برمجية متكاملة. أنصح بالتعامل معهم بشدة.' },
                        { name: 'فهد المطيري', text: 'جودة العمل والتواصل الرائع جعلت من ألترا خياري الأول في كل مشاريعي.' },
                        { name: 'يوسف العندس', text: 'شريت حساب تيك توك وتوصيل فوري وأسعار خرافية بصراحة، شكرا لثقتكم.' },
                        { name: 'نورة السالم', text: 'خدمات الكودينج والتطوير عندهم سريعة وما فيها أي أخطاء. فريق داعم بامتياز.' },
                        { name: 'تركي الفيصل', text: 'تصميم الهوية كامل لمطعمي كان من عندهم، شغل جبار وفخم جدا.' },
                        { name: 'عبدالرحمن الدوسري', text: 'مبرمجين محترفين جداً، موقعي أصبح أسرع بكثير بعد التعديل.' },
                        { name: 'شهد عبدالله', text: 'صراحة الموثوقية عندهم عالية جداً، التعامل راقي وسرعة بالرد على الاستفسارات.' },
                        { name: 'مشاري العنزي', text: 'الأسعار تنافسية جداً مقارنة بالجودة العالية التي استلمتها منهم.' },
                    ].map((review, i) => (
                        <div key={i} className="w-[85vw] sm:w-auto sm:min-w-[360px] shrink-0 snap-center bg-ultra-surface p-6 sm:p-8 rounded-[32px] border border-ultra-border transition-all duration-ultra hover:shadow-glow hover:border-ultra-silver-dark/30">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative w-14 h-14 rounded-full bg-ultra-card border border-ultra-border overflow-hidden">
                                    <Image src="/usr.jpg" alt={review.name} fill className="object-cover rounded-full" unoptimized />
                                </div>
                                <div>
                                    <h4 className=" font-bold text-ultra-silver-bright">{review.name}</h4>
                                </div>
                            </div>
                            <p className="text-ultra-silver-dark text-sm leading-relaxed italic">&quot;{review.text}&quot;</p>
                            <div className="mt-6 flex text-ultra-accent space-x-1 space-x-reverse">
                                {[1, 2, 3, 4, 5].map(s => <span key={s}>★</span>)}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Ads Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease]">
                    <div className="bg-ultra-card border border-ultra-border rounded-2xl w-full max-w-lg p-4 sm:p-6 relative shadow-ultra">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 text-ultra-silver-muted hover:text-white transition-colors bg-ultra-surface rounded-full hover:bg-ultra-border">
                            <X size={20} />
                        </button>
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">انضم كمسوق ألترا</h2>
                            <p className="text-ultra-silver-muted text-sm">سجل بياناتك وسيتم التواصل معك لبدء رحلتك كشريك نجاح</p>
                        </div>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
                            <div>
                                <label className="block text-sm text-ultra-silver-muted mb-1 font-bold">الاسم الكامل</label>
                                <input type="text" required className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 sm:py-3 text-white focus:border-ultra-silver-dark outline-none transition-colors text-sm" placeholder="الاسم ثلاثي" />
                            </div>
                            <div>
                                <label className="block text-sm text-ultra-silver-muted mb-1 font-bold">رقم الواتساب</label>
                                <input type="tel" required className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-2.5 sm:py-3 text-white outline-none transition-colors text-left font-mono text-sm" dir="ltr" placeholder="+966 ..." />
                            </div>
                            <div>
                                <label className="block text-sm text-ultra-silver-muted mb-1 font-bold">حساباتك وقنواتك (إن وجد)</label>
                                <textarea rows={3} className="w-full bg-ultra-surface border border-ultra-border rounded-xl px-4 py-3 text-white outline-none transition-colors" placeholder="رابط تيك توك، انستقرام، وغيرها..."></textarea>
                            </div>
                            <button className="w-full bg-ultra-silver-bright text-ultra-bg font-extrabold py-3.5 rounded-xl hover:bg-white transition-colors shadow-glow mt-4">
                                إرسال الطلب
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Product Slider Component
function ProductSlider({ title, desc, products, link }: { title: string, desc?: string, products: Product[], link?: string }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const isHovered = useRef(false);

    useEffect(() => {
        if (!products || products.length === 0) return;

        // Auto scrolling
        const interval = setInterval(() => {
            if (isHovered.current) return;
            const slider = scrollRef.current;
            if (slider) {
                const { scrollLeft, scrollWidth, clientWidth } = slider;
                // Since dir="rtl", scrollLeft is negative or zero.
                if (Math.abs(scrollLeft) >= scrollWidth - clientWidth - 10) {
                    slider.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    slider.scrollBy({ left: -300, behavior: 'smooth' });
                }
            }
        }, 2200);

        return () => clearInterval(interval);
    }, [products]);

    if (!products || products.length === 0) return null;

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = direction === 'left' ? -300 : 300;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    return (
        <section className="space-y-6 w-full max-w-7xl mx-auto px-4 sm:px-6 relative group">
            <div className="flex items-center justify-between w-full">
                <div>
                    <h2 className=" font-bold text-xl sm:text-3xl text-ultra-silver-bright">{title}</h2>
                    {desc && <p className="text-ultra-silver-muted mt-1 sm:mt-2 text-xs sm:text-sm">{desc}</p>}
                </div>
                <div className="flex items-center gap-4">
                    {/* Navigation Arrows for Desktop */}
                    <div className="hidden sm:flex items-center gap-2" dir="ltr">
                        <button
                            onClick={() => scroll('left')}
                            className="w-10 h-10 rounded-full bg-ultra-surface border border-ultra-border flex items-center justify-center text-ultra-silver-bright hover:bg-ultra-card hover:shadow-glow transition-all duration-ultra hover:scale-110 shadow-ultra"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-10 h-10 rounded-full bg-ultra-surface border border-ultra-border flex items-center justify-center text-ultra-silver-bright hover:bg-ultra-card hover:shadow-glow transition-all duration-ultra hover:scale-110 shadow-ultra"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    {link && (
                        <Link
                            href={link}
                            className="flex items-center gap-2 text-sm text-ultra-silver-muted hover:text-ultra-silver-bright transition-colors duration-ultra"
                        >
                            عرض الكل
                            <ArrowLeft size={16} />
                        </Link>
                    )}
                </div>
            </div>

            {/* Scrollable Container */}
            <div className="relative w-full">
                {/* 
                  Enhanced padding (-mx-4 px-4 for full bleed on mobile)
                  and py-8 to allow the hover:scale-[1.02] feature to not clip.
                */}
                <div
                    ref={scrollRef}
                    onMouseEnter={() => isHovered.current = true}
                    onMouseLeave={() => isHovered.current = false}
                    onTouchStart={() => isHovered.current = true}
                    onTouchEnd={() => isHovered.current = false}
                    className="flex w-full gap-3 sm:gap-4 py-6 sm:py-8 overflow-x-auto snap-x snap-mandatory scroll-smooth custom-scrollbar pb-6 sm:pb-8 -mx-4 px-4 sm:mx-0 sm:px-0"
                    dir="rtl"
                >
                    {products.map((product) => (
                        <div key={product.id} className="w-[150px] sm:w-[280px] shrink-0 snap-start">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
