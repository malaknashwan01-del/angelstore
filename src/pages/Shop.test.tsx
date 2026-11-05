import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAt } from "../test/utils";
import Shop from "./Shop";
import { products } from "../data/products";

const productLinks = () =>
  screen.getAllByRole("link").filter((a) => a.getAttribute("href")?.startsWith("/product/"));

describe("Shop page", () => {
  it("shows every product by default", () => {
    renderAt(<Shop />, { route: "/shop" });
    expect(productLinks()).toHaveLength(products.length);
  });

  it("filters by category", async () => {
    renderAt(<Shop />, { route: "/shop" });
    await userEvent.click(screen.getByRole("tab", { name: "Makeup" }));
    const makeup = products.filter((p) => p.category === "makeup");
    expect(productLinks()).toHaveLength(makeup.length);
  });

  it("reads the category from the URL", () => {
    renderAt(<Shop />, { route: "/shop?category=skincare" });
    expect(screen.getByRole("tab", { name: "Skin Care" })).toHaveAttribute("aria-selected", "true");
  });

  it("searches by name and shows an empty state", async () => {
    renderAt(<Shop />, { route: "/shop" });
    const search = screen.getByRole("searchbox", { name: "Search products" });
    await userEvent.type(search, "serum");
    expect(productLinks()).toHaveLength(3);

    await userEvent.clear(search);
    await userEvent.type(search, "zzz");
    expect(screen.getByText("No products found")).toBeInTheDocument();
  });

  it("sorts by price, low to high", async () => {
    renderAt(<Shop />, { route: "/shop" });
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Sort products" }), "price-asc");
    const first = productLinks()[0]!;
    expect(within(first).getByText("$10.00")).toBeInTheDocument();
  });
});
