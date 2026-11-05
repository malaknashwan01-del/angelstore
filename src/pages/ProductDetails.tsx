import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById, products } from "../data/products";
import { useCartStore } from "../store/cartStore";
import ProductImage from "../components/ProductImage";
import ProductCard from "../components/ProductCard";
import QuantityPicker from "../components/QuantityPicker";
import HeartButton from "../components/HeartButton";
import { TRY_ON_TYPES } from "../data/tryOn";
import { formatPrice } from "../lib/format";
import NotFound from "./NotFound";
import type { Product } from "../types";
import { usePageTitle } from "../lib/usePageTitle";

export default function ProductDetails() {
  const { id } = useParams();
  const product = getProductById(id);
  // key={id} بيرجّع الحالة من الأول لما تنتقل لمنتج ثاني
  if (!product) return <NotFound />;
  return <ProductView key={id} product={product} />;
}

function ProductView({ product }: { product: Product }) {
  usePageTitle(product.name);
  const addItem = useCartStore((s) => s.addItem);
  const [shade, setShade] = useState<string | null>(product.shades?.[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAdd = () => {
    addItem(product, shade, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 text-sm text-rose-ink/60">
        <Link to="/shop" className="hover:text-rose">Shop</Link>
        <span className="mx-2">/</span>
        <Link to={`/shop?category=${product.category}`} className="capitalize hover:text-rose">
          {product.category === "skincare" ? "Skin care" : "Makeup"}
        </Link>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="rounded-card bg-blush-50 p-8">
          <ProductImage
            product={product}
            color={product.type === "palette" ? undefined : shade ?? undefined}
            className="mx-auto w-full max-w-sm"
          />
        </div>

        <div>
          <p className="text-sm uppercase tracking-widest text-rose">{product.brand}</p>
          <h1 className="mt-2 font-display text-4xl leading-tight">{product.name}</h1>
          <p className="mt-2 text-sm text-rose-ink/60">
            ★ {product.rating} · {product.reviews} reviews
          </p>
          <p className="mt-6 text-3xl font-bold">{formatPrice(product.price)}</p>
          <p className="mt-6 leading-relaxed text-rose-ink/80">{product.description}</p>

          {product.shades && product.type !== "palette" && (
            <div className="mt-8">
              <p className="mb-3 text-sm font-medium">Shade</p>
              <div className="flex gap-3">
                {product.shades.map((s) => (
                  <button
                    key={s}
                    onClick={() => setShade(s)}
                    aria-label={`Shade ${s}`}
                    aria-pressed={shade === s}
                    className={`h-9 w-9 rounded-full border-2 transition ${
                      shade === s ? "scale-110 border-rose-ink" : "border-white shadow"
                    }`}
                    style={{ backgroundColor: s }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuantityPicker value={quantity} onChange={setQuantity} />
            <button
              onClick={handleAdd}
              className={`flex-1 rounded-full px-8 py-3 font-medium text-white transition-colors ${
                added ? "bg-rose-ink" : "bg-rose hover:bg-rose-dark"
              }`}
            >
              {added ? "Added to bag ✓" : "Add to bag"}
            </button>
            <HeartButton productId={product.id} className="h-12 w-12 border border-blush-200" />
          </div>

          {TRY_ON_TYPES.includes(product.type) && (
            <Link
              to={`/try-on?product=${product.id}&shade=${encodeURIComponent(shade ?? "")}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-rose hover:underline"
            >
              ✨ Try this shade on
            </Link>
          )}

          <ul className="mt-8 space-y-2 border-t border-blush-200 pt-6 text-sm text-rose-ink/70">
            <li>✿ Free shipping on orders over $50</li>
            <li>✿ Cruelty free & dermatologist tested</li>
            <li>✿ 30-day easy returns</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-6 font-display text-3xl">You may also love</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
