import { describe, expect, it } from "vitest";
import { buildRoutine, type Answers } from "./quiz";
import { getProductById } from "../test/fixtures";

const ids = (a: Answers) => buildRoutine(a, getProductById).map((s) => s.product.id);
const steps = (a: Answers) => buildRoutine(a, getProductById).map((s) => s.key);

describe("skin quiz routine", () => {
  it("builds a 3-step routine for minimal", () => {
    expect(steps({ skinType: "normal", concern: "dullness", routine: "minimal" })).toEqual([
      "cleanse",
      "moisturize",
      "protect",
    ]);
  });

  it("adds a treatment and a clay mask for oily skin with breakouts", () => {
    const routine = ids({ skinType: "oily", concern: "acne", routine: "complete" });
    expect(routine).toContain(17); // niacinamide
    expect(routine).toContain(14); // clay mask
    expect(routine).toHaveLength(6);
  });

  it("gives dry skin the rich barrier cream", () => {
    expect(ids({ skinType: "dry", concern: "aging", routine: "minimal" })).toContain(18);
  });

  it("never repeats the same product twice", () => {
    for (const concern of ["acne", "dullness", "aging", "dryness", "redness"] as const) {
      const routine = ids({ skinType: "normal", concern, routine: "complete" });
      expect(new Set(routine).size).toBe(routine.length);
    }
  });
});

describe("missing products", () => {
  it("skips a step when its product was removed from the store", () => {
    const routine = buildRoutine({ skinType: "oily", concern: "acne", routine: "complete" }, (id) =>
      id === 17 ? undefined : getProductById(id)
    );
    expect(routine.map((s) => s.key)).not.toContain("treat");
  });
});
