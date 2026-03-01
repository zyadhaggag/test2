'use client';

import { useNotificationStore } from '@/stores/notification-store';
import { X, ShoppingCart, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const typeStyles = {
    success: 'border-ultra-silver-bright/40 bg-ultra-surface/95 shadow-glow',
    error: 'border-red-500/50 bg-red-950/95 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    warning: 'border-orange-500/50 bg-orange-950/95 shadow-[0_0_15px_rgba(249,115,22,0.3)]',
    info: 'border-ultra-border bg-ultra-bg-secondary/95 shadow-ultra',
    cart: 'border-ultra-silver-bright/50 bg-[#1A1A1D]/95 shadow-[0_0_20px_rgba(229,231,235,0.2)]',
};

export function NotificationProvider() {
    const { notifications, removeNotification } = useNotificationStore();

    return (
        <div className="fixed top-6 right-4 sm:right-6 z-[9999] flex flex-col gap-4 w-auto max-w-sm sm:max-w-md">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`
            ${typeStyles[notification.type]}
            relative overflow-hidden
            rounded-2xl border backdrop-blur-xl
            px-4 sm:px-6 py-4 sm:py-5
            animate-[bounceIn_0.6s_cubic-bezier(0.68,-0.55,0.265,1.55)_forwards]
            transition-all duration-ultra
          `}
                >
                    {/* Progress Bar for Cart */}
                    {notification.type === 'cart' && (
                        <div
                            className="absolute bottom-0 right-0 h-1 bg-ultra-silver-bright"
                            style={{
                                animation: `shrinkWidth ${notification.duration || 4000}ms linear forwards`
                            }}
                        />
                    )}

                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            {notification.type === 'cart' && (
                                <div className="p-2 bg-ultra-surface rounded-xl text-ultra-silver-bright shrink-0">
                                    <ShoppingCart size={24} />
                                </div>
                            )}
                            {notification.type === 'success' && <CheckCircle size={20} className="text-ultra-silver-bright shrink-0" />}
                            <p className="text-sm sm:text-base text-white font-bold leading-relaxed line-clamp-2">
                                {notification.message}
                            </p>
                        </div>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-ultra-silver-muted hover:text-white transition-colors duration-ultra flex-shrink-0 mt-1 bg-ultra-bg/50 rounded-full p-1.5"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ))}

            <style jsx global>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: translateX(100px) rotate(2deg);
          }
          60% {
            opacity: 1;
            transform: translateX(-15px) rotate(-1deg);
          }
          80% {
            transform: translateX(5px) rotate(0.5deg);
          }
          100% {
            transform: translateX(0) rotate(0);
          }
        }
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
        </div>
    );
}
