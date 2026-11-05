import { Link } from "react-router-dom";
import { products, CATEGORIES, requireProduct } from "../data/products";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import type { Category, Product } from "../types";
import { usePageTitle } from "../lib/usePageTitle";

const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);
const [heroMain, heroLeft, heroRight] = [11, 1, 10].map(requireProduct) as [Product, Product, Product];
const categoryCovers: Record<Category, number> = { makeup: 4, skincare: 9 };

const perks = [
  { title: "Free shipping", text: "On every order over $50" },
  { title: "Cruelty free", text: "Never tested on animals" },
  { title: "Easy returns", text: "30 days, no questions asked" },
];

export default function Home() {
  usePageTitle();
  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden bg-gradient-to-b from-blush-100 to-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2 md:py-16">
          <div className="text-center md:text-left">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-rose">
              Makeup · Skin Care
            </p>
            <h1 className="font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
              Glow like an <em className="font-medium text-rose">angel</em>
            </h1>
            <p className="mx-auto mt-6 max-w-md text-lg text-rose-ink/70 md:mx-0">
              Gentle skincare and soft-glam makeup, picked for every skin type.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
              <Link
                to="/shop"
                className="rounded-full bg-rose px-8 py-3 font-medium text-white transition-colors hover:bg-rose-dark"
              >
                Shop now
              </Link>
              <Link
                to="/shop?category=skincare"
                className="rounded-full border border-rose px-8 py-3 font-medium text-rose transition-colors hover:bg-blush-100"
              >
                Skin care
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-xs md:max-w-md">
            <div className="absolute inset-6 rounded-full bg-blush-200" />
            <ProductImage product={heroMain} className="absolute left-[18%] top-[20%] w-[64%]" />
            <ProductImage product={heroLeft} className="absolute left-[-2%] top-[34%] w-[42%] -rotate-12" />
            <ProductImage product={heroRight} className="absolute right-[-2%] top-[30%] w-[42%] rotate-6" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 pt-14">
        <div className="grid gap-4 sm:grid-cols-2">
          {CATEGORIES.map((cat) => {
            const cover = requireProduct(categoryCovers[cat.slug]);
            return (
              <Link
                key={cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="group flex items-center justify-between overflow-hidden rounded-card bg-blush-100 p-6 transition-colors hover:bg-blush-200"
              >
                <div>
                  <h2 className="font-display text-3xl">{cat.label}</h2>
                  <p className="mt-1 text-sm text-rose">
                    {products.filter((p) => p.category === cat.slug).length} products →
                  </p>
                </div>
                <ProductImage
                  product={cover}
                  className="h-28 w-28 transition-transform duration-300 group-hover:scale-110"
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="mx-auto max-w-6xl px-4 pt-14">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl sm:text-4xl">Bestsellers</h2>
          <Link to="/shop" className="text-sm font-medium text-rose hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="mx-auto max-w-6xl px-4 pt-14">
        <div className="grid gap-4 rounded-card border border-blush-200 bg-white p-6 text-center sm:grid-cols-3">
          {perks.map((perk) => (
            <div key={perk.title}>
              <h3 className="font-display text-xl">{perk.title}</h3>
              <p className="mt-1 text-sm text-rose-ink/60">{perk.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
