// المنتجات اللي بتنفع للتجربة الافتراضية، ووين بتنحط على الوجه
import type { ProductType } from "../types";

export type Area = "lips" | "cheeks";
export type TryOnType = "lipstick" | "gloss" | "blush";

export const TRY_ON_TYPES: ProductType[] = ["lipstick", "gloss", "blush"];
export const AREA_BY_TYPE: Record<TryOnType, Area> = { lipstick: "lips", gloss: "lips", blush: "cheeks" };

export const isTryOnType = (type: ProductType): type is TryOnType => TRY_ON_TYPES.includes(type);

export interface SkinTone {
  name: string;
  skin: string;
  shade: string;
  lip: string;
  hair: string;
}

// كل درجة بشرة إلها لون شفايف طبيعي ولون شعر وظل
export const SKIN_TONES: SkinTone[] = [
  { name: "Porcelain", skin: "#f6dccb", shade: "#e9c2ab", lip: "#d99a92", hair: "#5b3a29" },
  { name: "Light", skin: "#ecc3a4", shade: "#dca684", lip: "#c9857a", hair: "#3b2418" },
  { name: "Medium", skin: "#d29f78", shade: "#bb855f", lip: "#a8675a", hair: "#2a1a12" },
  { name: "Tan", skin: "#a8724c", shade: "#8e5c3a", lip: "#7e4a3c", hair: "#1e130d" },
  { name: "Deep", skin: "#6f4630", shade: "#5a3624", lip: "#4f2c23", hair: "#140c08" },
];
