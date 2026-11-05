import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "../test/utils";
import { CUSTOMER, db } from "../test/mockApi";
import ProductDetails from "./ProductDetails";
import { useCartStore } from "../store/cartStore";

const renderProduct = (id: number) =>
  renderAt(<ProductDetails />, { route: `/product/${id}`, path: "/product/:id" });

describe("Product page", () => {
  it("adds the chosen shade and quantity to the bag", async () => {
    renderProduct(1);
    await userEvent.click(await screen.findByRole("button", { name: "Shade #a33a4a" }));
    await userEvent.click(screen.getByRole("button", { name: "Increase quantity" }));
    await userEvent.click(screen.getByRole("button", { name: "Add to bag" }));

    expect(useCartStore.getState().items).toEqual([
      expect.objectContaining({ id: 1, shade: "#a33a4a", quantity: 2 }),
    ]);
  });

  it("sends guests to sign in when they tap the heart", async () => {
    renderProduct(11);
    const [heart] = await screen.findAllByRole("button", { name: "Add to wishlist" });
    await userEvent.click(heart!);
    expect(screen.getByTestId("location")).toHaveTextContent("/login?next=%2Fproduct%2F11");
  });

  it("saves to the wishlist when signed in", async () => {
    db.user = CUSTOMER;
    renderProduct(11);
    const [heart] = await screen.findAllByRole("button", { name: "Add to wishlist" });
    await userEvent.click(heart!);
    expect(await screen.findAllByRole("button", { name: "Remove from wishlist" })).not.toHaveLength(0);
    expect(db.wishlist).toEqual([11]);
  });

  it("lets a signed-in user post a review", async () => {
    db.user = CUSTOMER;
    renderProduct(2);
    expect(await screen.findByText("Love this shade!")).toBeInTheDocument();

    await userEvent.click(await screen.findByRole("button", { name: "Write a review" }));
    await userEvent.click(screen.getByRole("button", { name: "4 stars" }));
    await userEvent.type(screen.getByRole("textbox", { name: "Your review" }), "Gorgeous shine.");
    await userEvent.click(screen.getByRole("button", { name: "Post review" }));

    expect(await screen.findByText("Gorgeous shine.")).toBeInTheDocument();
    expect(screen.getByText("Sara Ahmad (you)")).toBeInTheDocument();
  });

  it("asks guests to sign in before reviewing", async () => {
    renderProduct(2);
    expect(await screen.findByRole("link", { name: "Sign in to write a review" })).toBeInTheDocument();
  });

  it("shows a not found page for unknown products", async () => {
    renderProduct(999);
    expect(await screen.findByText("This page flew away")).toBeInTheDocument();
  });
});
