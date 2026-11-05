import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "../test/utils";
import Navbar from "./Navbar";
import { useCartStore } from "../store/cartStore";
import { requireProduct } from "../data/products";

describe("Navbar", () => {
  it("opens and closes the mobile menu", async () => {
    renderAt(<Navbar />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");

    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });

  it("shows how many items are in the bag", () => {
    useCartStore.getState().addItem(requireProduct(1), "#c2185b", 2);
    renderAt(<Navbar />);
    expect(screen.getByRole("link", { name: /bag/i })).toHaveTextContent("Bag2");
  });
});
