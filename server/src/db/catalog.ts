import type { products } from "./schema.js";

// كتالوج البداية — بينضاف لقاعدة البيانات أول مرة بيشتغل السيرفر
export const catalog: (typeof products.$inferInsert)[] = [
  {
    name: "Velvet Kiss Matte Lipstick",
    brand: "Angel Beauty",
    category: "makeup",
    type: "lipstick",
    color: "#c2185b",
    priceCents: 1800,
    description: "A creamy matte lipstick that glides on in one swipe and stays comfortable all day. Enriched with shea butter so your lips never feel dry.",
    bestseller: true,
    shades: [
      "#c2185b",
      "#d9536f",
      "#a33a4a",
      "#e8889a"
    ]
  },
  {
    name: "Glass Shine Lip Gloss",
    brand: "Angel Beauty",
    category: "makeup",
    type: "gloss",
    color: "#f48fb1",
    priceCents: 1400,
    description: "A non-sticky high-shine gloss with a sheer pink tint. Wear it alone for a glassy look or layer it over your favorite lipstick.",
    bestseller: false,
    shades: [
      "#f48fb1",
      "#f7b6cb",
      "#e57399"
    ]
  },
  {
    name: "Rosy Cheeks Powder Blush",
    brand: "Petal & Co",
    category: "makeup",
    type: "blush",
    color: "#f2a0b5",
    priceCents: 2200,
    description: "Silky, buildable blush that melts into skin for a natural flush. One tap gives a soft glow; build it up for more color.",
    bestseller: true,
    shades: [
      "#f2a0b5",
      "#e88a8a",
      "#d8708d"
    ]
  },
  {
    name: "Blossom Eyeshadow Palette",
    brand: "Petal & Co",
    category: "makeup",
    type: "palette",
    color: "#e57399",
    priceCents: 3600,
    description: "Nine wearable shades from soft nude to deep berry, in matte and shimmer finishes. Everything you need for day and night looks.",
    bestseller: true,
    shades: [
      "#f7d6dc",
      "#e8a5b4",
      "#c97b8e",
      "#8d4a5d",
      "#d9b38c",
      "#5a2b3a"
    ]
  },
  {
    name: "Feather Lift Mascara",
    brand: "Angel Beauty",
    category: "makeup",
    type: "mascara",
    color: "#2b1a22",
    priceCents: 1900,
    description: "Lifts, separates and curls lashes without clumping. Smudge-proof formula that lasts up to 12 hours and removes easily with warm water.",
    bestseller: false,
    shades: null
  },
  {
    name: "Second Skin Foundation",
    brand: "Lumière Lab",
    category: "makeup",
    type: "foundation",
    color: "#e0b393",
    priceCents: 3400,
    description: "Lightweight medium coverage with a natural satin finish. Blurs imperfections while letting your skin breathe. SPF 15.",
    bestseller: false,
    shades: [
      "#f3d2bd",
      "#e0b393",
      "#c69071",
      "#9c6a4c",
      "#6e4630"
    ]
  },
  {
    name: "Soft Focus Setting Powder",
    brand: "Lumière Lab",
    category: "makeup",
    type: "compact",
    color: "#f3d2bd",
    priceCents: 2600,
    description: "A finely milled translucent powder that sets makeup and controls shine without looking cakey or flat.",
    bestseller: false,
    shades: null
  },
  {
    name: "Halo Liquid Highlighter",
    brand: "Petal & Co",
    category: "makeup",
    type: "dropper",
    color: "#f6c7a8",
    priceCents: 2400,
    description: "A few drops give a lit-from-within glow. Mix with foundation or tap onto cheekbones, nose and cupid's bow.",
    bestseller: false,
    shades: null
  },
  {
    name: "Rose Water Hydrating Toner",
    brand: "Bloom Skin",
    category: "skincare",
    type: "toner",
    color: "#f7b6cb",
    priceCents: 2100,
    description: "An alcohol-free toner made with Damask rose water and hyaluronic acid. Calms redness and preps skin to absorb your serum.",
    bestseller: true,
    shades: null
  },
  {
    name: "Vitamin C Glow Serum",
    brand: "Bloom Skin",
    category: "skincare",
    type: "serum",
    color: "#f5b971",
    priceCents: 3200,
    description: "15% vitamin C brightens dull skin and fades dark spots over time. Lightweight, absorbs fast and works under makeup.",
    bestseller: true,
    shades: null
  },
  {
    name: "Cloud Cream Daily Moisturizer",
    brand: "Bloom Skin",
    category: "skincare",
    type: "jar",
    color: "#ffd0df",
    priceCents: 2800,
    description: "A whipped gel-cream with ceramides and niacinamide that hydrates for 24 hours without feeling heavy. Suitable for all skin types.",
    bestseller: true,
    shades: null
  },
  {
    name: "Gentle Foam Cleanser",
    brand: "Pure Petal",
    category: "skincare",
    type: "pump",
    color: "#ffe8ef",
    priceCents: 1600,
    description: "A soft, low-pH foam that removes makeup and sunscreen without stripping skin. Fragrance-free and gentle enough for sensitive skin.",
    bestseller: false,
    shades: null
  },
  {
    name: "Daily Shield Sunscreen SPF 50",
    brand: "Pure Petal",
    category: "skincare",
    type: "tube",
    color: "#fff1c9",
    priceCents: 2300,
    description: "Broad-spectrum SPF 50 with no white cast. Feels like a light moisturizer and sits perfectly under makeup.",
    bestseller: false,
    shades: null
  },
  {
    name: "Pink Clay Purifying Mask",
    brand: "Pure Petal",
    category: "skincare",
    type: "jar",
    color: "#e8a5b4",
    priceCents: 2500,
    description: "French pink clay draws out impurities and refines pores while rosehip oil keeps skin soft. Use twice a week.",
    bestseller: false,
    shades: null
  },
  {
    name: "Night Repair Retinol Serum",
    brand: "Lumière Lab",
    category: "skincare",
    type: "dropper",
    color: "#c9a4d8",
    priceCents: 3800,
    description: "Encapsulated retinol smooths fine lines and evens texture overnight, with squalane to keep skin comfortable.",
    bestseller: false,
    shades: null
  },
  {
    name: "Petal Soft Lip Balm",
    brand: "Bloom Skin",
    category: "skincare",
    type: "balm",
    color: "#f48fb1",
    priceCents: 1000,
    description: "A nourishing balm with rose oil and vitamin E that repairs dry lips overnight and leaves a hint of pink.",
    bestseller: false,
    shades: null
  },
  {
    name: "Clear Skin Niacinamide Serum",
    brand: "Pure Petal",
    category: "skincare",
    type: "dropper",
    color: "#b9dcc8",
    priceCents: 2700,
    description: "10% niacinamide and zinc calm breakouts, control oil and visibly tighten pores without drying skin out.",
    bestseller: false,
    shades: null
  },
  {
    name: "Barrier Repair Rich Cream",
    brand: "Bloom Skin",
    category: "skincare",
    type: "jar",
    color: "#fbe3d3",
    priceCents: 3100,
    description: "A cushiony cream with ceramides, oat and shea that repairs a dry, irritated skin barrier and soothes tightness.",
    bestseller: false,
    shades: null
  }
];
