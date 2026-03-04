import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  price?: string | number;
  addedAt: number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = get().items;
        if (!currentItems.find((i) => i._id === item._id)) {
          set({ items: [...currentItems, { ...item, addedAt: Date.now() }] });
        }
      },
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i._id !== id) })),
      clearWishlist: () => set({ items: [] }),
      isInWishlist: (id) => get().items.some((i) => i._id === id),
    }),
    {
      name: 'noble-mosaic-wishlist',
    }
  )
);
