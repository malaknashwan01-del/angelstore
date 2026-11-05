import { describe, expect, it } from "vitest";
import { formatPrice, getShipping, SHIPPING_COST } from "./format";

describe("format helpers", () => {
  it("formats prices with two decimals", () => {
    expect(formatPrice(18)).toBe("$18.00");
    expect(formatPrice(4.5)).toBe("$4.50");
  });

  it("charges shipping below $50 and ships free from $50", () => {
    expect(getShipping(0)).toBe(0);
    expect(getShipping(49.99)).toBe(SHIPPING_COST);
    expect(getShipping(50)).toBe(0);
  });
});
