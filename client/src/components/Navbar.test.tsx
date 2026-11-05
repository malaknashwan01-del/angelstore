import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "../test/utils";
import { ADMIN, CUSTOMER, db } from "../test/mockApi";
import Navbar from "./Navbar";
import { useCartStore } from "../store/cartStore";
import { requireProduct } from "../test/fixtures";

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

  it("shows sign in for guests, account for customers and admin for admins", async () => {
    const { unmount } = renderAt(<Navbar />);
    expect((await screen.findAllByRole("link", { name: "Sign in" }))[0]).toHaveAttribute("href", "/login");
    unmount();

    db.user = CUSTOMER;
    const second = renderAt(<Navbar />);
    expect((await screen.findAllByRole("link", { name: "Account" }))[0]).toHaveAttribute("href", "/account");
    second.unmount();

    db.user = ADMIN;
    renderAt(<Navbar />);
    expect((await screen.findAllByRole("link", { name: "Admin" }))[0]).toHaveAttribute("href", "/admin");
  });
});
