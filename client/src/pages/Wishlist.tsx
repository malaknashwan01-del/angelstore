import { Link } from "react-router-dom";
import { useMe } from "../hooks/useAuth";
import { useWishlist } from "../hooks/useWishlist";
import { useProductMap } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/States";
import { usePageTitle } from "../lib/usePageTitle";
import type { Product } from "../types";

export default function Wishlist() {
  usePageTitle("Wishlist");
  const { data: user, isPending: userPending } = useMe();
  const { data: ids = [], isPending: idsPending } = useWishlist();
  const { map, isPending: productsPending } = useProductMap();
  const saved = ids.map((id) => map.get(id)).filter((p): p is Product => Boolean(p));
  const loading = userPending || (user && (idsPending || productsPending));

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl sm:text-5xl">Wishlist</h1>

      {loading ? (
        <div className="mt-8">
          <ProductGridSkeleton count={4} />
        </div>
      ) : !user ? (
        <div className="mt-10 rounded-card bg-blush-50 p-10 text-center">
          <p className="font-display text-2xl">Sign in to see your wishlist</p>
          <p className="mt-2 text-rose-ink/60">Your saved products follow you on every device.</p>
          <Link to="/login?next=/wishlist" className="mt-6 inline-block rounded-full bg-rose px-8 py-3 font-medium text-white hover:bg-rose-dark">
            Sign in
          </Link>
        </div>
      ) : saved.length === 0 ? (
        <div className="mt-10 rounded-card bg-blush-50 p-10 text-center">
          <p className="font-display text-2xl">Nothing saved yet</p>
          <p className="mt-2 text-rose-ink/60">Tap the ♡ on any product to save it here.</p>
          <Link to="/shop" className="mt-6 inline-block rounded-full bg-rose px-8 py-3 font-medium text-white hover:bg-rose-dark">
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-2 text-rose-ink/60">{saved.length} saved</p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {saved.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
