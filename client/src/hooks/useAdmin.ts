import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Order, OrderStatus, Product, ProductInput } from "../types";

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => api<{ orders: Order[] }>("/admin/orders").then((d) => d.orders),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      api<{ order: Order }>(`/admin/orders/${id}`, { method: "PATCH", body: { status } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "orders"] }),
  });
}

export function useSaveProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id?: number; input: ProductInput }) =>
      api<{ product: Product }>(id ? `/admin/products/${id}` : "/admin/products", {
        method: id ? "PUT" : "POST",
        body: input,
      }).then((d) => d.product),
    onSuccess: (product) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.setQueryData(["product", product.id], product);
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api(`/admin/products/${id}`, { method: "DELETE" }),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.removeQueries({ queryKey: ["product", id] });
    },
  });
}
