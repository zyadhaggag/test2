'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { Service } from '@/lib/supabase/types';

interface ServiceCardProps {
    service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
    return (
        <Link href={`/service/${service.id}`} className="block group">
            <div className="bg-ultra-card border border-ultra-border rounded-ultra overflow-hidden transition-all duration-ultra hover:shadow-glow hover:scale-[1.02] hover:border-ultra-silver-dark/40">
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover transition-transform duration-ultra group-hover:scale-105"
                    />
                </div>

                <div className="p-4 space-y-3">
                    <h3 className=" font-bold text-ultra-silver-bright text-sm leading-tight line-clamp-2">
                        {service.name}
                    </h3>

                    <p className="text-xs text-ultra-silver-muted line-clamp-2 leading-relaxed">
                        {service.description}
                    </p>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                size={13}
                                className={
                                    i < Math.round(service.rating)
                                        ? 'fill-ultra-accent text-ultra-accent'
                                        : 'text-ultra-silver-dark'
                                }
                            />
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <span className=" font-bold text-lg text-ultra-silver-bright">
                                {service.price}
                            </span>
                            <Image src="/ryal.svg" alt="ريال" width={18} height={18} />
                        </div>
                        {service.old_price && (
                            <div className="flex items-center gap-1">
                                <span className="text-sm text-ultra-silver-dark line-through">
                                    {service.old_price}
                                </span>
                                <Image src="/ryal.svg" alt="ريال" width={14} height={14} className="opacity-40" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
