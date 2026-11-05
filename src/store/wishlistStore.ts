import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  ids: number[];
  toggle: (id: number) => void;
  has: (id: number) => boolean;
}

// المفضلة — بنخزن أرقام المنتجات بس، والتفاصيل بنجيبها من الكتالوج
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set({
          ids: get().ids.includes(id)
            ? get().ids.filter((x) => x !== id)
            : [...get().ids, id],
        }),
      has: (id) => get().ids.includes(id),
    }),
    { name: "angelstore-wishlist" }
  )
);
