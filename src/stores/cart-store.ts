import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const existing = get().items.find((i) => i.id === item.id);
                if (!existing) {
                    set({ items: [...get().items, { ...item, quantity: 1 }] });
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((i) => i.id !== id) });
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    set({ items: get().items.filter((i) => i.id !== id) });
                } else {
                    set({
                        items: get().items.map((i) =>
                            i.id === id ? { ...i, quantity } : i
                        ),
                    });
                }
            },

            clearCart: () => set({ items: [] }),

            getTotal: () =>
                get().items.reduce((sum, item) => sum + item.price, 0),

            getItemCount: () =>
                get().items.length,
        }),
        { name: 'ultra-cart' }
    )
);
