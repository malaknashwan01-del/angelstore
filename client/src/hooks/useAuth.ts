import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { User } from "../types";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => api<{ user: User | null }>("/auth/me").then((d) => d.user),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      api<{ user: User }>("/auth/login", { method: "POST", body }).then((d) => d.user),
    onSuccess: (user) => {
      qc.setQueryData(["me"], user);
      qc.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { name: string; email: string; password: string }) =>
      api<{ user: User }>("/auth/register", { method: "POST", body }).then((d) => d.user),
    onSuccess: (user) => qc.setQueryData(["me"], user),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api<void>("/auth/logout", { method: "POST" }),
    onSuccess: () => {
      qc.setQueryData(["me"], null);
      // بيانات الحساب السابق ما لازم تضل بالكاش
      qc.removeQueries({ queryKey: ["wishlist"] });
      qc.removeQueries({ queryKey: ["orders"] });
      qc.removeQueries({ queryKey: ["admin"] });
    },
  });
}
