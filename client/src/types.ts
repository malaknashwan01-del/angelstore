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

export interface User {
  id: number;
  name: string;
  email: string;
  role: "customer" | "admin";
}

export interface Review {
  id: number;
  rating: number;
  body: string;
  createdAt: string;
  userId: number;
  author: string;
}

export type OrderStatus = "placed" | "shipped" | "delivered" | "cancelled";

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
}

export interface Order {
  id: number;
  status: OrderStatus;
  createdAt: string;
  shipping: ShippingDetails;
  subtotal: number;
  shippingCost: number;
  total: number;
  items: { productId: number | null; name: string; unitPrice: number; quantity: number; shade: string | null }[];
  customer?: { name: string; email: string };
}

export type ProductInput = Omit<Product, "id" | "rating" | "reviews">;

export type ShopSort = "featured" | "price-asc" | "price-desc" | "rating";
