import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "../types";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, shade?: string | null, quantity?: number) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
}

// السلة — محفوظة بالـ localStorage، فما بتضيع لما تعمل refresh.
// الـ key بيجمع رقم المنتج واللون، عشان نفس الروج بلونين يكونوا عنصرين منفصلين.

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, shade = null, quantity = 1) => {
        const key = `${product.id}-${shade ?? "default"}`;
        const existing = get().items.find((i) => i.key === key);

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.key === key ? { ...i, quantity: i.quantity + quantity } : i
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                key,
                id: product.id,
                name: product.name,
                price: product.price,
                shade,
                quantity,
              },
            ],
          });
        }
      },

      removeItem: (key) =>
        set({ items: get().items.filter((i) => i.key !== key) }),

      updateQuantity: (key, quantity) => {
        if (quantity <= 0) return get().removeItem(key);
        set({
          items: get().items.map((i) => (i.key === key ? { ...i, quantity } : i)),
        });
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: "angelstore-cart" }
  )
);

// قيم محسوبة — بنحسبها من الـ items بدل ما نخزنها
export const selectCount = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.quantity, 0);

export const selectSubtotal = (s: CartState) =>
  s.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
