import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "../test/utils";
import TryOn from "./TryOn";
import { useCartStore } from "../store/cartStore";

describe("Virtual try-on", () => {
  it("opens with the shade passed in the link", async () => {
    renderAt(<TryOn />, { route: "/try-on?product=1&shade=%23a33a4a" });
    expect(await screen.findByRole("button", { name: "Apply shade #a33a4a" })).toHaveAttribute("aria-pressed", "true");
  });

  it("combines a lip and a cheek product into one look", async () => {
    renderAt(<TryOn />, { route: "/try-on" });
    await userEvent.click(await screen.findByRole("button", { name: "Apply shade #d9536f" }));
    await userEvent.click(screen.getByRole("button", { name: /rosy cheeks/i }));
    await userEvent.click(screen.getByRole("button", { name: "Apply shade #e88a8a" }));

    await userEvent.click(screen.getByRole("button", { name: "Add this look to bag" }));
    expect(useCartStore.getState().items.map((i) => [i.id, i.shade])).toEqual([
      [1, "#d9536f"],
      [3, "#e88a8a"],
    ]);
  });
});
