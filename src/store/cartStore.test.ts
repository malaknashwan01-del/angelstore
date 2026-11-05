import { describe, expect, it } from "vitest";
import { useCartStore, selectCount, selectSubtotal } from "./cartStore";
import { requireProduct } from "../data/products";

const lipstick = requireProduct(1); // $18
const cream = requireProduct(11); // $28
const cart = () => useCartStore.getState();

describe("cart store", () => {
  it("adds a new product with quantity 1", () => {
    cart().addItem(cream);
    expect(cart().items).toHaveLength(1);
    expect(cart().items[0]).toMatchObject({ id: 11, quantity: 1, shade: null });
  });

  it("merges the same product and shade into one line", () => {
    cart().addItem(lipstick, "#c2185b");
    cart().addItem(lipstick, "#c2185b", 2);
    expect(cart().items).toHaveLength(1);
    expect(cart().items[0]!.quantity).toBe(3);
  });

  it("keeps different shades of the same product as separate lines", () => {
    cart().addItem(lipstick, "#c2185b");
    cart().addItem(lipstick, "#a33a4a");
    expect(cart().items).toHaveLength(2);
  });

  it("removes an item when its quantity drops to 0", () => {
    cart().addItem(cream);
    cart().updateQuantity(cart().items[0]!.key, 0);
    expect(cart().items).toEqual([]);
  });

  it("calculates count and subtotal", () => {
    cart().addItem(lipstick, "#c2185b", 2);
    cart().addItem(cream);
    expect(selectCount(cart())).toBe(3);
    expect(selectSubtotal(cart())).toBe(18 * 2 + 28);
  });

  it("saves the bag to localStorage", () => {
    cart().addItem(cream);
    expect(localStorage.getItem("angelstore-cart")).toContain('"id":11');
  });
});
