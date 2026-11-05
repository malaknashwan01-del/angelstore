import type { Product } from "../types";

export type SkinType = "oily" | "dry" | "combination" | "sensitive" | "normal";
export type Concern = "acne" | "dullness" | "aging" | "dryness" | "redness";
export type RoutineSize = "minimal" | "complete";

export interface Answers {
  skinType: SkinType;
  concern: Concern;
  routine: RoutineSize;
}

export interface Question {
  id: keyof Answers;
  title: string;
  options: { value: string; label: string; hint?: string }[];
}

type StepKey = "cleanse" | "tone" | "treat" | "moisturize" | "protect" | "mask";

interface Step {
  label: string;
  when: string;
  pick: (a: Answers) => number;
}

export interface RoutineStep extends Omit<Step, "pick"> {
  key: StepKey;
  product: Product;
}

export const QUESTIONS: Question[] = [
  {
    id: "skinType",
    title: "How does your skin feel by midday?",
    options: [
      { value: "oily", label: "Shiny all over", hint: "Oily" },
      { value: "dry", label: "Tight or flaky", hint: "Dry" },
      { value: "combination", label: "Shiny T-zone, dry cheeks", hint: "Combination" },
      { value: "sensitive", label: "Easily red or itchy", hint: "Sensitive" },
      { value: "normal", label: "Comfortable and balanced", hint: "Normal" },
    ],
  },
  {
    id: "concern",
    title: "What would you most like to improve?",
    options: [
      { value: "acne", label: "Breakouts & pores" },
      { value: "dullness", label: "Dullness & dark spots" },
      { value: "aging", label: "Fine lines & texture" },
      { value: "dryness", label: "Dryness" },
      { value: "redness", label: "Redness & irritation" },
    ],
  },
  {
    id: "routine",
    title: "How much time do you have for skincare?",
    options: [
      { value: "minimal", label: "Keep it quick", hint: "3 steps" },
      { value: "complete", label: "I love a full routine", hint: "5 steps + weekly mask" },
    ],
  },
];

// كل خطوة بالروتين وشو المنتج المناسب إلها حسب الإجابات
const TREATMENT_BY_CONCERN: Record<Concern, number> = {
  acne: 17, // Niacinamide
  dullness: 10, // Vitamin C
  aging: 15, // Retinol
  dryness: 9, // Rose toner + hyaluronic
  redness: 9,
};

const STEPS: Record<StepKey, Step> = {
  cleanse: { label: "Cleanse", when: "AM & PM", pick: () => 12 },
  tone: { label: "Tone", when: "AM & PM", pick: () => 9 },
  treat: {
    label: "Treat",
    when: "PM",
    pick: (a: Answers) => {
      const id = TREATMENT_BY_CONCERN[a.concern];
      // التونر موجود أصلاً بخطوة Tone، فبنختار سيروم بديل
      return id === 9 ? (a.skinType === "oily" ? 17 : 10) : id;
    },
  },
  moisturize: {
    label: "Moisturize",
    when: "AM & PM",
    pick: (a: Answers) =>
      ["dry", "sensitive"].includes(a.skinType) || ["dryness", "redness"].includes(a.concern)
        ? 18
        : 11,
  },
  protect: { label: "Protect", when: "AM", pick: () => 13 },
  mask: { label: "Weekly mask", when: "1–2× a week", pick: () => 14 },
};

/**
 * بيبني الروتين من الإجابات.
 * getProduct بيجيب المنتج برقمه (من الـ API) — إذا منتج انحذف بنتخطى الخطوة
 */
export function buildRoutine(answers: Answers, getProduct: (id: number) => Product | undefined): RoutineStep[] {
  const order: StepKey[] =
    answers.routine === "minimal"
      ? ["cleanse", "moisturize", "protect"]
      : ["cleanse", "tone", "treat", "moisturize", "protect"];

  // الماسك الطيني بيناسب البشرة الدهنية والمختلطة
  if (answers.routine === "complete" && ["oily", "combination"].includes(answers.skinType)) {
    order.push("mask");
  }

  return order.flatMap((key) => {
    const { label, when, pick } = STEPS[key];
    const product = getProduct(pick(answers));
    return product ? [{ key, label, when, product }] : [];
  });
}
