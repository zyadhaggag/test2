import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

interface FavoritesState {
    favorites: string[]; // List of product IDs
    isLoading: boolean;
    fetchFavorites: (userId: string) => Promise<void>;
    toggleFavorite: (userId: string, productId: string) => Promise<void>;
    clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
    favorites: [],
    isLoading: false,

    fetchFavorites: async (userId) => {
        set({ isLoading: true });
        const supabase = createClient();
        const { data, error } = await supabase
            .from('favorites')
            .select('product_id')
            .eq('user_id', userId);

        if (!error && data) {
            set({ favorites: data.map((f) => f.product_id), isLoading: false });
        } else {
            console.error('[Favorites] fetch error:', error);
            set({ isLoading: false });
        }
    },

    toggleFavorite: async (userId, productId) => {
        const { favorites } = get();
        const isFav = favorites.includes(productId);
        const supabase = createClient();

        // Optimistic update
        if (isFav) {
            set({ favorites: favorites.filter((id) => id !== productId) });
            await supabase.from('favorites').delete().match({ user_id: userId, product_id: productId });
        } else {
            set({ favorites: [...favorites, productId] });
            await supabase.from('favorites').insert({ user_id: userId, product_id: productId });
        }
    },

    clearFavorites: () => set({ favorites: [] }),
}));
