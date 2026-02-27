'use client';

import { useNotificationStore } from '@/stores/notification-store';
import { X } from 'lucide-react';

const typeStyles = {
    success: 'border-ultra-silver-bright/30 bg-ultra-surface/90',
    error: 'border-ultra-silver-dark/50 bg-ultra-bg/95',
    warning: 'border-ultra-silver-muted/30 bg-ultra-card/90',
    info: 'border-ultra-border bg-ultra-bg-secondary/90',
};

export function NotificationProvider() {
    const { notifications, removeNotification } = useNotificationStore();

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`
            ${typeStyles[notification.type]}
            rounded-ultra border backdrop-blur-xl
            px-5 py-4 shadow-ultra
            animate-[fadeSlideIn_0.3s_ease]
            transition-all duration-ultra
          `}
                    style={{
                        animation: 'fadeSlideIn 0.3s ease forwards',
                    }}
                >
                    <div className="flex items-start justify-between gap-3">
                        <p className="text-sm text-ultra-silver-bright font-tajawal leading-relaxed">
                            {notification.message}
                        </p>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-ultra-silver-muted hover:text-ultra-silver-bright transition-colors duration-ultra flex-shrink-0 mt-0.5"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ))}

            <style jsx global>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
        </div>
    );
}
