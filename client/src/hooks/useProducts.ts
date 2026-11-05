import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Category, Product, ShopSort } from "../types";

export interface ProductFilters {
  category?: Category;
  q?: string;
  sort?: ShopSort;
  bestseller?: boolean;
  limit?: number;
}

const toQuery = (f: ProductFilters) => {
  const params = new URLSearchParams();
  if (f.category) params.set("category", f.category);
  if (f.q) params.set("q", f.q);
  if (f.sort && f.sort !== "featured") params.set("sort", f.sort);
  if (f.bestseller) params.set("bestseller", "true");
  if (f.limit) params.set("limit", String(f.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => api<{ products: Product[] }>(`/products${toQuery(filters)}`).then((d) => d.products),
    // وقت البحث بنخلي النتائج القديمة ظاهرة لحد ما توصل الجديدة، بدل ما الصفحة ترمش
    placeholderData: keepPreviousData,
  });
}

/** كل المنتجات كـ Map — للصفحات اللي بتحتاج تلاقي منتج برقمه (السلة، الاختبار...) */
export function useProductMap() {
  const query = useProducts();
  const map = new Map((query.data ?? []).map((p) => [p.id, p]));
  return { ...query, map };
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => api<{ product: Product }>(`/products/${id}`).then((d) => d.product),
    enabled: Number.isInteger(id) && id > 0,
    retry: (count, error) => (error as { status?: number }).status !== 404 && count < 2,
  });
}
