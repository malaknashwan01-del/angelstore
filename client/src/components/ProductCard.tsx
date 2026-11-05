import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";
import HeartButton from "./HeartButton";
import { formatPrice } from "../lib/format";
import type { Product } from "../types";

export default function ProductCard({ product }: { product: Product }) {
  const { id, name, brand, price, rating, reviews, bestseller } = product;

  return (
    <Link
      to={`/product/${id}`}
      className="group flex flex-col overflow-hidden rounded-card border border-blush-200 bg-white transition hover:-translate-y-1 hover:shadow-lg hover:shadow-blush-200"
    >
      <div className="relative aspect-square bg-blush-50">
        {bestseller && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-rose">
            Bestseller
          </span>
        )}
        <HeartButton productId={id} className="absolute right-3 top-3 z-10" />
        <ProductImage
          product={product}
          className="h-full w-full p-6 transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs uppercase tracking-widest text-rose">{brand}</p>
        <h3 className="font-display text-lg leading-snug">{name}</h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-bold">{formatPrice(price)}</span>
          {reviews > 0 && (
            <span className="text-sm text-rose-ink/60">
              ★ {rating} <span className="text-rose-ink/40">({reviews})</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
