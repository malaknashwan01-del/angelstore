import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Order, ShippingDetails } from "../types";

export interface NewOrder {
  items: { productId: number; quantity: number; shade: string | null }[];
  shipping: ShippingDetails;
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => api<{ orders: Order[] }>("/orders").then((d) => d.orders),
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => api<{ order: Order }>(`/orders/${id}`).then((d) => d.order),
    enabled: Number.isInteger(id) && id > 0,
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: NewOrder) => api<{ order: Order }>("/orders", { method: "POST", body }).then((d) => d.order),
    onSuccess: (order) => {
      qc.setQueryData(["orders", order.id], order);
      qc.invalidateQueries({ queryKey: ["orders"], exact: true });
    },
  });
}
