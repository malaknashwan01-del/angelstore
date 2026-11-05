import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "../test/utils";
import Checkout from "./Checkout";
import { validate } from "../lib/checkoutValidation";
import { useCartStore } from "../store/cartStore";
import { requireProduct } from "../data/products";

const valid = {
  fullName: "Sara Ahmad",
  email: "sara@example.com",
  phone: "0599 123 456",
  city: "Gaza",
  address: "Omar Al-Mukhtar St",
};

describe("checkout validation", () => {
  it("accepts a complete form", () => {
    expect(validate(valid)).toEqual({});
  });

  it("rejects a bad email and phone", () => {
    const errors = validate({ ...valid, email: "sara@", phone: "12" });
    expect(Object.keys(errors).sort()).toEqual(["email", "phone"]);
  });
});

describe("Checkout page", () => {
  it("redirects to the bag when it is empty", () => {
    renderAt(<Checkout />, { route: "/checkout", path: "/checkout" });
    expect(screen.getByText("Cart page")).toBeInTheDocument();
  });

  it("shows every error when submitted empty", async () => {
    useCartStore.getState().addItem(requireProduct(11));
    renderAt(<Checkout />, { route: "/checkout", path: "/checkout" });
    await userEvent.click(screen.getByRole("button", { name: "Place order" }));
    expect(screen.getAllByText(/please enter|is required/i)).toHaveLength(5);
  });
});
