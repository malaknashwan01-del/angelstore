import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "../test/utils";
import { CUSTOMER, db } from "../test/mockApi";
import Checkout from "./Checkout";
import { validate } from "../lib/checkoutValidation";
import { useCartStore } from "../store/cartStore";
import { requireProduct } from "../test/fixtures";

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
    expect(screen.getAllByText(/please enter|is required|at least 3/i)).toHaveLength(5);
  });

  it("places the order on the server and clears the bag", async () => {
    db.user = CUSTOMER;
    useCartStore.getState().addItem(requireProduct(1), "#a33a4a", 2);
    renderAt(<Checkout />, { route: "/checkout", path: "/checkout" });

    await userEvent.type(screen.getByRole("textbox", { name: "Full name" }), valid.fullName);
    await userEvent.type(screen.getByRole("textbox", { name: "Email" }), valid.email);
    await userEvent.type(screen.getByRole("textbox", { name: "Phone" }), valid.phone);
    await userEvent.type(screen.getByRole("textbox", { name: "City" }), valid.city);
    await userEvent.type(screen.getByRole("textbox", { name: "Street address" }), valid.address);
    await userEvent.click(screen.getByRole("button", { name: "Place order" }));

    expect(await screen.findByText("Order success page")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("/order-success?id=100");
    expect(db.orders[0]!.items).toEqual([expect.objectContaining({ productId: 1, quantity: 2, shade: "#a33a4a" })]);
    expect(useCartStore.getState().items).toEqual([]);
  });
});
