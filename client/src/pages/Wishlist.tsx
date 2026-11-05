import { Link } from "react-router-dom";
import { useWishlistStore } from "../store/wishlistStore";
import { getProductById } from "../data/products";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types";
import { usePageTitle } from "../lib/usePageTitle";

export default function Wishlist() {
  usePageTitle("Wishlist");
  const ids = useWishlistStore((s) => s.ids);
  const saved = ids
    .map((id) => getProductById(id))
    .filter((p): p is Product => Boolean(p));

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl sm:text-5xl">Wishlist</h1>

      {saved.length === 0 ? (
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
