import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "../test/utils";
import ProductDetails from "./ProductDetails";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

const renderProduct = (id: number) =>
  renderAt(<ProductDetails />, { route: `/product/${id}`, path: "/product/:id" });

describe("Product page", () => {
  it("adds the chosen shade and quantity to the bag", async () => {
    renderProduct(1);
    await userEvent.click(screen.getByRole("button", { name: "Shade #a33a4a" }));
    await userEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
    await userEvent.click(screen.getByRole("button", { name: "Add to bag" }));

    expect(useCartStore.getState().items).toEqual([
      expect.objectContaining({ id: 1, shade: "#a33a4a", quantity: 2 }),
    ]);
    expect(screen.getByRole("button", { name: "Added to bag ✓" })).toBeInTheDocument();
  });

  it("toggles the wishlist", async () => {
    renderProduct(11);
    const [heart] = screen.getAllByRole("button", { name: "Add to wishlist" });
    await userEvent.click(heart!);
    expect(useWishlistStore.getState().ids).toEqual([11]);
  });

  it("shows a not found page for unknown products", () => {
    renderProduct(999);
    expect(screen.getByText("This page flew away")).toBeInTheDocument();
  });
});
