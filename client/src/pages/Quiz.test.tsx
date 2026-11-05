import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "../test/utils";
import Quiz from "./Quiz";
import { useCartStore } from "../store/cartStore";

describe("Skin quiz", () => {
  it("walks through the questions and adds the routine to the bag", async () => {
    renderAt(<Quiz />, { route: "/quiz" });
    await userEvent.click(screen.getByRole("button", { name: /tight or flaky/i }));
    await userEvent.click(screen.getByRole("button", { name: /dryness/i }));
    await userEvent.click(screen.getByRole("button", { name: /keep it quick/i }));

    expect(await screen.findByRole("heading", { name: "Your dry skin routine" })).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);

    await userEvent.click(screen.getByRole("button", { name: "Add routine to bag" }));
    expect(useCartStore.getState().items).toHaveLength(3);
  });

  it("can go back to the previous question", async () => {
    renderAt(<Quiz />, { route: "/quiz" });
    await userEvent.click(screen.getByRole("button", { name: /shiny all over/i }));
    await userEvent.click(screen.getByRole("button", { name: /back/i }));
    expect(screen.getByRole("heading", { name: /how does your skin feel/i })).toBeInTheDocument();
  });
});
