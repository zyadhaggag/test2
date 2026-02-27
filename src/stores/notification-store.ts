import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
    duration?: number;
}

interface NotificationState {
    notifications: Notification[];
    addNotification: (type: NotificationType, message: string, duration?: number) => void;
    removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],

    addNotification: (type, message, duration = 4000) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        set({ notifications: [...get().notifications, { id, type, message, duration }] });
        setTimeout(() => {
            get().removeNotification(id);
        }, duration);
    },

    removeNotification: (id) => {
        set({ notifications: get().notifications.filter((n) => n.id !== id) });
    },
}));
