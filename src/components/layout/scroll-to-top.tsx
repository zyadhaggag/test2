'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';

export function ScrollToTop() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [pathname]);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-[90px] sm:bottom-8 right-4 sm:right-8 p-3 rounded-full bg-ultra-bg-secondary/80 backdrop-blur-md border border-ultra-border text-ultra-silver-bright shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all duration-300 z-50 hover:scale-110 hover:bg-ultra-surface hover:shadow-glow ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                }`}
            aria-label="العودة للأعلى"
        >
            <ArrowUp size={24} />
        </button>
    );
}
