'use client';

import { useLoadingStore } from '@/stores/loading-store';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export function GlobalLoading() {
    const isLoading = useLoadingStore((s) => s.isLoading);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setVisible(true);
        } else {
            const t = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(t);
        }
    }, [isLoading]);

    if (!visible) return null;

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-ultra-bg/80 backdrop-blur-md transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-col items-center justify-center p-8 bg-ultra-card border border-ultra-border rounded-[32px] shadow-glow animate-pulse">
                <div className="relative w-32 h-12 mb-4">
                    <Image src="/imgs/logo/logo.png" alt="ULTRA Loading" fill className="object-contain" priority />
                </div>
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-ultra-silver-bright animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-ultra-silver-bright animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-ultra-silver-bright animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
}
