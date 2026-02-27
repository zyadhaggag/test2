'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { HeroSlide } from '@/lib/supabase/types';

interface HeroSliderProps {
    slides: HeroSlide[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
    const [current, setCurrent] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(nextSlide, 4000);
        return () => clearInterval(interval);
    }, [nextSlide, slides.length]);

    if (slides.length === 0) return null;

    return (
        <div className="relative w-full rounded-[32px] overflow-hidden shadow-ultra" style={{ height: '320px' }}>
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                    style={{ opacity: index === current ? 1 : 0 }}
                >
                    {slide.link ? (
                        <Link href={slide.link} className="block w-full h-full">
                            <Image
                                src={slide.image}
                                alt={`Slide ${index + 1}`}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                        </Link>
                    ) : (
                        <Image
                            src={slide.image}
                            alt={`Slide ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                    )}
                </div>
            ))}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`
              rounded-full transition-all duration-ultra
              ${index === current
                                ? 'w-8 h-2.5 bg-ultra-silver-bright'
                                : 'w-2.5 h-2.5 bg-ultra-silver-dark/60 hover:bg-ultra-silver-muted'
                            }
            `}
                    />
                ))}
            </div>
        </div>
    );
}
