import { create } from 'zustand';

interface FavoritesModalState {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

export const useFavoritesModalStore = create<FavoritesModalState>((set) => ({
    isOpen: false,
    openModal: () => set({ isOpen: true }),
    closeModal: () => set({ isOpen: false }),
}));
