import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Review } from "../types";

export function useReviews(productId: number) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => api<{ reviews: Review[] }>(`/products/${productId}/reviews`).then((d) => d.reviews),
  });
}

function useRefreshProduct(productId: number) {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ["reviews", productId] });
    qc.invalidateQueries({ queryKey: ["product", productId] });
    qc.invalidateQueries({ queryKey: ["products"] });
  };
}

export function useSaveReview(productId: number) {
  const refresh = useRefreshProduct(productId);
  return useMutation({
    mutationFn: (body: { rating: number; body: string }) =>
      api(`/products/${productId}/reviews`, { method: "PUT", body }),
    onSuccess: refresh,
  });
}

export function useDeleteReview(productId: number) {
  const refresh = useRefreshProduct(productId);
  return useMutation({
    mutationFn: () => api(`/products/${productId}/reviews`, { method: "DELETE" }),
    onSuccess: refresh,
  });
}
