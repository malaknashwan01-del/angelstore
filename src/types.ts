export type Category = "makeup" | "skincare";

export type ProductType =
  | "lipstick" | "gloss" | "blush" | "compact" | "palette" | "mascara"
  | "foundation" | "toner" | "serum" | "dropper" | "pump" | "jar" | "tube" | "balm";

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: Category;
  type: ProductType;
  /** لون العبوة أو المنتج بالرسمة */
  color: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  bestseller?: boolean;
  shades?: string[];
}

export interface CartItem {
  /** رقم المنتج + اللون، عشان نفس المنتج بلونين يكون عنصرين */
  key: string;
  id: number;
  name: string;
  price: number;
  shade: string | null;
  quantity: number;
}
