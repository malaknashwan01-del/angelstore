import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach } from "vitest";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

// كل اختبار بيبدأ بسلة ومفضلة فاضيين
beforeEach(() => {
  localStorage.clear();
  useCartStore.setState({ items: [] });
  useWishlistStore.setState({ ids: [] });
});

afterEach(cleanup);
