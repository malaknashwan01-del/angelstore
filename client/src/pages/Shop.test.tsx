import { describe, expect, it } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { renderAt } from "../test/utils";
import { server } from "../test/mockApi";
import { products } from "../test/fixtures";
import Shop from "./Shop";

const productLinks = () =>
  screen.queryAllByRole("link").filter((a) => a.getAttribute("href")?.startsWith("/product/"));

describe("Shop page", () => {
  it("shows a loading skeleton, then every product", async () => {
    renderAt(<Shop />, { route: "/shop" });
    expect(screen.getByLabelText("Loading products")).toBeInTheDocument();
    expect(await screen.findByText(`${products.length} products`)).toBeInTheDocument();
    expect(productLinks()).toHaveLength(products.length);
  });

  it("filters by category", async () => {
    renderAt(<Shop />, { route: "/shop" });
    await screen.findByText(`${products.length} products`);
    await userEvent.click(screen.getByRole("tab", { name: "Makeup" }));
    const makeup = products.filter((p) => p.category === "makeup").length;
    expect(await screen.findByText(`${makeup} products`)).toBeInTheDocument();
  });

  it("reads the category from the URL", async () => {
    renderAt(<Shop />, { route: "/shop?category=skincare" });
    expect(screen.getByRole("tab", { name: "Skin Care" })).toHaveAttribute("aria-selected", "true");
    const skincare = products.filter((p) => p.category === "skincare").length;
    expect(await screen.findByText(`${skincare} products`)).toBeInTheDocument();
  });

  it("searches and shows an empty state", async () => {
    renderAt(<Shop />, { route: "/shop" });
    await screen.findByText(`${products.length} products`);
    const search = screen.getByRole("searchbox", { name: "Search products" });

    await userEvent.type(search, "serum");
    expect(await screen.findByText("3 products")).toBeInTheDocument();

    await userEvent.clear(search);
    await userEvent.type(search, "zzz");
    expect(await screen.findByText("No products found")).toBeInTheDocument();
  });

  it("sorts by price, low to high", async () => {
    renderAt(<Shop />, { route: "/shop" });
    await screen.findByText(`${products.length} products`);
    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Sort products" }), "price-asc");
    await waitFor(() => expect(within(productLinks()[0]!).getByText("$10.00")).toBeInTheDocument());
  });

  it("shows an error with a retry button when the server fails", async () => {
    server.use(http.get("*/api/products", () => HttpResponse.json({ error: "Database is down" }, { status: 500 })));
    renderAt(<Shop />, { route: "/shop" });
    expect(await screen.findByText("Database is down")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });
});
