import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useMe } from "./useAuth";

type Ids = { ids: number[] };

export function useWishlist() {
  const { data: user } = useMe();
  return useQuery({
    queryKey: ["wishlist", user?.id],
    queryFn: () => api<Ids>("/wishlist").then((d) => d.ids),
    enabled: Boolean(user),
  });
}

export function useToggleWishlist() {
  const qc = useQueryClient();
  const { data: user } = useMe();
  const navigate = useNavigate();
  const location = useLocation();
  const key = ["wishlist", user?.id];

  const mutation = useMutation({
    mutationFn: ({ id, saved }: { id: number; saved: boolean }) =>
      api<Ids>(`/wishlist/${id}`, { method: saved ? "DELETE" : "PUT" }).then((d) => d.ids),
    // تحديث فوري (optimistic): القلب بيتعبى قبل ما يرد السيرفر، وإذا فشل بنرجّعه
    onMutate: async ({ id, saved }) => {
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<number[]>(key) ?? [];
      qc.setQueryData(key, saved ? previous.filter((x) => x !== id) : [...previous, id]);
      return { previous };
    },
    onError: (_err, _vars, context) => qc.setQueryData(key, context?.previous),
    onSuccess: (ids) => qc.setQueryData(key, ids),
  });

  return (id: number, saved: boolean) => {
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }
    mutation.mutate({ id, saved });
  };
}
