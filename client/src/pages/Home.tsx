import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/categories";
import { SKIN_TONES } from "../data/tryOn";
import { useProductMap } from "../hooks/useProducts";
import { ProductGridSkeleton, ErrorState } from "../components/States";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import FaceModel from "../components/FaceModel";
import Reveal from "../components/Reveal";
import type { Category, Product } from "../types";
import { usePageTitle } from "../lib/usePageTitle";

const categoryCovers: Record<Category, number> = { makeup: 4, skincare: 9 };

const MARQUEE = ["Free shipping over $50", "Cruelty free", "Dermatologist tested", "30-day returns", "Try shades virtually", "Take the skin quiz"];

const SPARKLES = [
  { top: "12%", left: "8%", size: 18, d: "3s" },
  { top: "22%", left: "88%", size: 14, d: "2.4s" },
  { top: "70%", left: "4%", size: 12, d: "3.6s" },
  { top: "82%", left: "92%", size: 20, d: "2.8s" },
  { top: "4%", left: "78%", size: 10, d: "4s" },
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** نجمة صغيرة بتلمع */
function Sparkle({ size, style }: { size: number; style: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="animate-twinkle absolute text-rose" style={style} aria-hidden="true">
      <path d="M12 0c.6 6 1.9 9.4 12 12-10.1 2.6-11.4 6-12 12-.6-6-1.9-9.4-12-12C10.1 9.4 11.4 6 12 0z" fill="currentColor" />
    </svg>
  );
}

/** منتج بيطفو وبيتحرك مع الماوس — depth بتحدد قديش بيتحرك */
function FloatingProduct({ product, depth, className, rotate = 0, duration = "6s" }: {
  product: Product;
  depth: number;
  className: string;
  rotate?: number;
  duration?: string;
}) {
  return (
    <div
      className={`absolute transition-transform duration-700 ease-out ${className}`}
      style={{ transform: `translate(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${depth}px))` }}
    >
      <div className="animate-float drop-shadow-xl" style={{ "--r": `${rotate}deg`, "--d": duration } as CSSProperties}>
        <ProductImage product={product} className="w-full" />
      </div>
    </div>
  );
}

function Hero({ map }: { map: Map<number, Product> }) {
  const ref = useRef<HTMLElement>(null);
  const [main, left, right, back] = [11, 1, 10, 3].map((id) => map.get(id));

  // بنحفظ مكان الماوس كمتغيرات CSS — بدون re-render للـ React
  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--px", String(((e.clientX - rect.left) / rect.width - 0.5) * 2));
    ref.current.style.setProperty("--py", String(((e.clientY - rect.top) / rect.height - 0.5) * 2));
  };

  const words = ["Glow", "like", "an"];

  return (
    <section ref={ref} onPointerMove={onPointerMove} className="relative overflow-hidden bg-gradient-to-b from-blush-100 via-blush-50 to-cream">
      {/* دوائر ملونة متحركة بالخلفية */}
      <div className="animate-blob absolute -left-24 -top-24 h-80 w-80 bg-petal/60 blur-3xl" aria-hidden="true" />
      <div className="animate-blob absolute -right-20 top-40 h-96 w-96 bg-[#ffd9c7]/70 blur-3xl [animation-delay:-5s]" aria-hidden="true" />
      <div className="animate-blob absolute bottom-0 left-1/3 h-72 w-72 bg-blush-200/80 blur-3xl [animation-delay:-9s]" aria-hidden="true" />
      {SPARKLES.map((s, i) => (
        <Sparkle key={i} size={s.size} style={{ top: s.top, left: s.left, "--d": s.d } as CSSProperties} />
      ))}

      <div className="relative mx-auto grid max-w-6xl items-center gap-6 px-4 py-14 md:grid-cols-2 md:py-20">
        <div className="text-center md:text-left">
          <p className="animate-rise mb-5 text-sm uppercase tracking-[0.3em] text-rose">Makeup · Skin Care</p>

          <h1 className="font-display text-5xl font-bold leading-[1.2] sm:text-6xl lg:text-7xl">
            {words.map((w, i) => (
              <span key={w} className="animate-rise mr-[0.25em] inline-block" style={{ animationDelay: `${150 + i * 120}ms` }}>
                {w}
              </span>
            ))}
            <span className="animate-rise relative inline-block" style={{ animationDelay: "560ms" }}>
              {/* هالة الملاك فوق الكلمة */}
              <svg viewBox="0 0 100 20" className="animate-float absolute left-[24%] top-[0.02em] w-[46%]" style={{ "--d": "4s" } as CSSProperties} aria-hidden="true">
                <ellipse cx="50" cy="10" rx="46" ry="6" fill="none" stroke="#d99a3d" strokeWidth="3" />
              </svg>
              <em className="text-shimmer pr-1 font-medium">angel</em>
            </span>
          </h1>

          <p className="animate-rise mx-auto mt-6 max-w-md text-lg text-rose-ink/70 md:mx-0" style={{ animationDelay: "750ms" }}>
            Gentle skincare and soft-glam makeup, picked for every skin type.
          </p>

          <div className="animate-rise mt-8 flex flex-wrap justify-center gap-3 md:justify-start" style={{ animationDelay: "900ms" }}>
            <Link
              to="/shop"
              className="group relative overflow-hidden rounded-full bg-rose px-8 py-3 font-medium text-white shadow-lg shadow-rose/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose/40"
            >
              {/* لمعة بتمر على الزر عند الهوفر */}
              <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-white/30 transition-all duration-700 group-hover:left-[130%]" aria-hidden="true" />
              Shop now
            </Link>
            <Link
              to="/quiz"
              className="rounded-full border border-rose bg-white/50 px-8 py-3 font-medium text-rose backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              Find my routine
            </Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-xs md:max-w-md">
          <div
            className="absolute inset-[8%] rounded-full bg-gradient-to-br from-white to-blush-200 shadow-[inset_0_-20px_60px_rgba(231,90,138,0.15)] transition-transform duration-700 ease-out"
            style={{ transform: "translate(calc(var(--px, 0) * -8px), calc(var(--py, 0) * -8px))" }}
          />
          {back && <FloatingProduct product={back} depth={-10} className="right-[4%] top-[4%] w-[26%] opacity-90" rotate={10} duration="7s" />}
          {main && <FloatingProduct product={main} depth={14} className="left-[20%] top-[18%] w-[60%]" duration="6s" />}
          {left && <FloatingProduct product={left} depth={26} className="left-[-4%] top-[36%] w-[40%]" rotate={-12} duration="5s" />}
          {right && <FloatingProduct product={right} depth={20} className="right-[-4%] top-[34%] w-[40%]" rotate={8} duration="5.5s" />}
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  // النص مكرر مرتين عشان الحركة تكون مستمرة بدون قفزة
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="overflow-hidden bg-rose-ink py-3 text-blush-100" aria-label={MARQUEE.join(", ")}>
      <div className="animate-marquee flex w-max gap-10 whitespace-nowrap text-sm font-medium uppercase tracking-[0.2em]" aria-hidden="true">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-10">
            {t} <span className="text-petal">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** معاينة التجربة الافتراضية — لون الروج بيتغير لحاله */
function TryOnTeaser({ lipstick }: { lipstick?: Product }) {
  const shades = lipstick?.shades ?? ["#c2185b", "#d9536f", "#a33a4a", "#e8889a"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % shades.length), 1600);
    return () => clearInterval(t);
  }, [shades.length]);

  return (
    <div className="grid items-center gap-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-blush-100 via-white to-blush-50 p-6 sm:p-10 md:grid-cols-[1fr_1.1fr]">
      <div className="relative mx-auto w-full max-w-[280px]">
        <FaceModel tone={SKIN_TONES[2]!} lips={shades[index]} cheeks="#f2a0b5" />
        <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-white/90 px-3 py-2 shadow-lg backdrop-blur">
          {shades.map((s, i) => (
            <span
              key={s}
              className={`h-5 w-5 rounded-full transition-transform duration-300 ${i === index ? "scale-125 ring-2 ring-rose-ink ring-offset-2" : ""}`}
              style={{ backgroundColor: s }}
            />
          ))}
        </div>
      </div>
      <div className="text-center md:text-left">
        <p className="text-sm uppercase tracking-[0.25em] text-rose">Virtual try-on</p>
        <h2 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">See it on before you buy it</h2>
        <p className="mt-4 text-rose-ink/70">
          Swipe through lipstick, gloss and blush shades on five skin tones. Build a full look and add it to your bag in one tap.
        </p>
        <Link
          to="/try-on"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-rose-ink px-8 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:bg-rose-dark"
        >
          Try it on <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  usePageTitle();
  const { data: products = [], map, isPending, error, refetch } = useProductMap();
  const bestsellers = products.filter((p) => p.bestseller).slice(0, 4);

  return (
    <>
      <Hero map={map} />
      <Marquee />

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <div className="grid gap-4 sm:grid-cols-2">
          {CATEGORIES.map((cat, i) => {
            const cover = map.get(categoryCovers[cat.slug]);
            const count = products.filter((p) => p.category === cat.slug).length;
            return (
              <Reveal key={cat.slug} delay={i * 120}>
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="group relative flex items-center justify-between overflow-hidden rounded-card bg-blush-100 p-6 transition-colors hover:bg-blush-200"
                >
                  <div className="relative z-10">
                    <h2 className="font-display text-3xl">{cat.label}</h2>
                    <p className="mt-1 text-sm text-rose">
                      {isPending ? "Explore" : `${count} products`}{" "}
                      <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </p>
                  </div>
                  <div className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-white/50 transition-transform duration-500 group-hover:scale-125" aria-hidden="true" />
                  {cover && (
                    <ProductImage
                      product={cover}
                      className="relative h-28 w-28 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                    />
                  )}
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Try-on teaser */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <Reveal>
          <TryOnTeaser lipstick={map.get(1)} />
        </Reveal>
      </section>

      {/* Bestsellers */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <Reveal className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-3xl sm:text-4xl">Bestsellers</h2>
          <Link to="/shop" className="text-sm font-medium text-rose hover:underline">
            View all →
          </Link>
        </Reveal>
        {isPending ? (
          <ProductGridSkeleton count={4} className="grid-cols-2 md:grid-cols-4" />
        ) : error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {bestsellers.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Quiz CTA */}
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-rose px-6 py-14 text-center text-white sm:px-12">
            <div className="animate-blob absolute -left-16 -top-16 h-64 w-64 bg-white/15 blur-2xl" aria-hidden="true" />
            <div className="animate-blob absolute -bottom-20 -right-10 h-72 w-72 bg-rose-ink/30 blur-2xl [animation-delay:-6s]" aria-hidden="true" />
            <div className="relative">
              <p className="text-sm uppercase tracking-[0.25em] text-blush-100">1-minute skin quiz</p>
              <h2 className="mx-auto mt-3 max-w-xl font-display text-4xl leading-tight sm:text-5xl">Not sure where to start?</h2>
              <p className="mx-auto mt-4 max-w-md text-blush-100">
                Answer 3 questions and get a routine built for your skin type and goals.
              </p>
              <Link
                to="/quiz"
                className="mt-8 inline-block rounded-full bg-white px-8 py-3 font-medium text-rose-dark transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Take the quiz
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
