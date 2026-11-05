// كتالوج AngelStore — كل المنتجات موجودة داخل المشروع، فالمتجر بيشتغل دايماً.
// كل منتج إله "type" بيحدد شكل الصورة، و "color" لون العبوة أو المنتج.

import type { Category, Product } from "../types";

// بيانات وهمية للاختبارات — نفس كتالوج السيرفر

export const CATEGORIES: { slug: Category; label: string }[] = [
  { slug: "makeup", label: "Makeup" },
  { slug: "skincare", label: "Skin Care" },
];

export const products: Product[] = [
  // ---------- Makeup ----------
  {
    id: 1,
    name: "Velvet Kiss Matte Lipstick",
    brand: "Angel Beauty",
    category: "makeup",
    type: "lipstick",
    color: "#c2185b",
    price: 18,
    rating: 4.8,
    reviews: 214,
    bestseller: true,
    shades: ["#c2185b", "#d9536f", "#a33a4a", "#e8889a"],
    description:
      "A creamy matte lipstick that glides on in one swipe and stays comfortable all day. Enriched with shea butter so your lips never feel dry.",
  },
  {
    id: 2,
    name: "Glass Shine Lip Gloss",
    brand: "Angel Beauty",
    category: "makeup",
    type: "gloss",
    color: "#f48fb1",
    price: 14,
    rating: 4.6,
    reviews: 168,
    shades: ["#f48fb1", "#f7b6cb", "#e57399"],
    description:
      "A non-sticky high-shine gloss with a sheer pink tint. Wear it alone for a glassy look or layer it over your favorite lipstick.",
  },
  {
    id: 3,
    name: "Rosy Cheeks Powder Blush",
    brand: "Petal & Co",
    category: "makeup",
    type: "blush",
    color: "#f2a0b5",
    price: 22,
    rating: 4.7,
    reviews: 132,
    bestseller: true,
    shades: ["#f2a0b5", "#e88a8a", "#d8708d"],
    description:
      "Silky, buildable blush that melts into skin for a natural flush. One tap gives a soft glow; build it up for more color.",
  },
  {
    id: 4,
    name: "Blossom Eyeshadow Palette",
    brand: "Petal & Co",
    category: "makeup",
    type: "palette",
    color: "#e57399",
    price: 36,
    rating: 4.9,
    reviews: 301,
    bestseller: true,
    shades: ["#f7d6dc", "#e8a5b4", "#c97b8e", "#8d4a5d", "#d9b38c", "#5a2b3a"],
    description:
      "Nine wearable shades from soft nude to deep berry, in matte and shimmer finishes. Everything you need for day and night looks.",
  },
  {
    id: 5,
    name: "Feather Lift Mascara",
    brand: "Angel Beauty",
    category: "makeup",
    type: "mascara",
    color: "#2b1a22",
    price: 19,
    rating: 4.5,
    reviews: 189,
    description:
      "Lifts, separates and curls lashes without clumping. Smudge-proof formula that lasts up to 12 hours and removes easily with warm water.",
  },
  {
    id: 6,
    name: "Second Skin Foundation",
    brand: "Lumière Lab",
    category: "makeup",
    type: "foundation",
    color: "#e0b393",
    price: 34,
    rating: 4.6,
    reviews: 257,
    shades: ["#f3d2bd", "#e0b393", "#c69071", "#9c6a4c", "#6e4630"],
    description:
      "Lightweight medium coverage with a natural satin finish. Blurs imperfections while letting your skin breathe. SPF 15.",
  },
  {
    id: 7,
    name: "Soft Focus Setting Powder",
    brand: "Lumière Lab",
    category: "makeup",
    type: "compact",
    color: "#f3d2bd",
    price: 26,
    rating: 4.4,
    reviews: 96,
    description:
      "A finely milled translucent powder that sets makeup and controls shine without looking cakey or flat.",
  },
  {
    id: 8,
    name: "Halo Liquid Highlighter",
    brand: "Petal & Co",
    category: "makeup",
    type: "dropper",
    color: "#f6c7a8",
    price: 24,
    rating: 4.7,
    reviews: 143,
    description:
      "A few drops give a lit-from-within glow. Mix with foundation or tap onto cheekbones, nose and cupid's bow.",
  },

  // ---------- Skin Care ----------
  {
    id: 9,
    name: "Rose Water Hydrating Toner",
    brand: "Bloom Skin",
    category: "skincare",
    type: "toner",
    color: "#f7b6cb",
    price: 21,
    rating: 4.8,
    reviews: 276,
    bestseller: true,
    description:
      "An alcohol-free toner made with Damask rose water and hyaluronic acid. Calms redness and preps skin to absorb your serum.",
  },
  {
    id: 10,
    name: "Vitamin C Glow Serum",
    brand: "Bloom Skin",
    category: "skincare",
    type: "serum",
    color: "#f5b971",
    price: 32,
    rating: 4.7,
    reviews: 318,
    bestseller: true,
    description:
      "15% vitamin C brightens dull skin and fades dark spots over time. Lightweight, absorbs fast and works under makeup.",
  },
  {
    id: 11,
    name: "Cloud Cream Daily Moisturizer",
    brand: "Bloom Skin",
    category: "skincare",
    type: "jar",
    color: "#ffd0df",
    price: 28,
    rating: 4.9,
    reviews: 402,
    bestseller: true,
    description:
      "A whipped gel-cream with ceramides and niacinamide that hydrates for 24 hours without feeling heavy. Suitable for all skin types.",
  },
  {
    id: 12,
    name: "Gentle Foam Cleanser",
    brand: "Pure Petal",
    category: "skincare",
    type: "pump",
    color: "#ffe8ef",
    price: 16,
    rating: 4.6,
    reviews: 221,
    description:
      "A soft, low-pH foam that removes makeup and sunscreen without stripping skin. Fragrance-free and gentle enough for sensitive skin.",
  },
  {
    id: 13,
    name: "Daily Shield Sunscreen SPF 50",
    brand: "Pure Petal",
    category: "skincare",
    type: "tube",
    color: "#fff1c9",
    price: 23,
    rating: 4.7,
    reviews: 189,
    description:
      "Broad-spectrum SPF 50 with no white cast. Feels like a light moisturizer and sits perfectly under makeup.",
  },
  {
    id: 14,
    name: "Pink Clay Purifying Mask",
    brand: "Pure Petal",
    category: "skincare",
    type: "jar",
    color: "#e8a5b4",
    price: 25,
    rating: 4.5,
    reviews: 118,
    description:
      "French pink clay draws out impurities and refines pores while rosehip oil keeps skin soft. Use twice a week.",
  },
  {
    id: 15,
    name: "Night Repair Retinol Serum",
    brand: "Lumière Lab",
    category: "skincare",
    type: "dropper",
    color: "#c9a4d8",
    price: 38,
    rating: 4.6,
    reviews: 154,
    description:
      "Encapsulated retinol smooths fine lines and evens texture overnight, with squalane to keep skin comfortable.",
  },
  {
    id: 16,
    name: "Petal Soft Lip Balm",
    brand: "Bloom Skin",
    category: "skincare",
    type: "balm",
    color: "#f48fb1",
    price: 10,
    rating: 4.8,
    reviews: 233,
    description:
      "A nourishing balm with rose oil and vitamin E that repairs dry lips overnight and leaves a hint of pink.",
  },
  {
    id: 17,
    name: "Clear Skin Niacinamide Serum",
    brand: "Pure Petal",
    category: "skincare",
    type: "dropper",
    color: "#b9dcc8",
    price: 27,
    rating: 4.7,
    reviews: 208,
    description:
      "10% niacinamide and zinc calm breakouts, control oil and visibly tighten pores without drying skin out.",
  },
  {
    id: 18,
    name: "Barrier Repair Rich Cream",
    brand: "Bloom Skin",
    category: "skincare",
    type: "jar",
    color: "#fbe3d3",
    price: 31,
    rating: 4.8,
    reviews: 176,
    description:
      "A cushiony cream with ceramides, oat and shea that repairs a dry, irritated skin barrier and soothes tightness.",
  },
];

/** للمنتجات اللي لازم تكون موجودة (زي اللي مكتوبة بالكود) — بترمي خطأ إذا مش موجودة */
export function requireProduct(id: number): Product {
  const product = getProductById(id);
  if (!product) throw new Error(`Product ${id} not found`);
  return product;
}

export function getProductById(id: number | string | null | undefined): Product | undefined {
  return products.find((p) => p.id === Number(id));
}
