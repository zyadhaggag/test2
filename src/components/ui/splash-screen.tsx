'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export function SplashScreen() {
    const [isMounted, setIsMounted] = useState(false);
    const [opacity, setOpacity] = useState(1);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        document.body.style.overflow = 'hidden';

        const timer1 = setTimeout(() => {
            setOpacity(0);
            document.body.style.overflow = '';
        }, 1500); // Start fade out after 1.5s

        const timer2 = setTimeout(() => {
            setIsVisible(false);
        }, 2200); // Remove from DOM after transition completes

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            document.body.style.overflow = '';
        };
    }, []);

    if (!isMounted || !isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#0F0F12] transition-opacity duration-700"
            style={{ opacity }}
        >
            <div className="relative animate-pulse drop-shadow-[0_0_40px_rgba(255,255,255,0.15)] mb-8">
                <Image
                    src="/imgs/logo/logo.png"
                    alt="ULTRA"
                    width={280}
                    height={100}
                    className="w-56 sm:w-72 h-auto object-contain"
                    priority
                />
            </div>

            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2.5 h-2.5 rounded-full bg-ultra-silver-bright animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2.5 h-2.5 rounded-full bg-ultra-silver-muted animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
}
