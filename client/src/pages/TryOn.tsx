import { useState } from "react";
import type { Product } from "../types";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { ErrorState, Spinner } from "../components/States";
import { AREA_BY_TYPE, SKIN_TONES, isTryOnType, type Area } from "../data/tryOn";
import { useCartStore } from "../store/cartStore";
import FaceModel from "../components/FaceModel";
import ProductImage from "../components/ProductImage";
import { formatPrice } from "../lib/format";
import { usePageTitle } from "../lib/usePageTitle";

type Applied = Partial<Record<Area, { productId: number; shade: string }>>;

const areaOf = (p: Product): Area => (isTryOnType(p.type) ? AREA_BY_TYPE[p.type] : "lips");

// الحالة المبدئية من الرابط، مثلاً جاي من صفحة المنتج: ?product=1&shade=#c2185b
function initialLook(params: URLSearchParams, tryOnProducts: Product[]): { selectedId: number; applied: Applied } {
  const product = tryOnProducts.find((p) => p.id === Number(params.get("product")));
  if (!product?.shades?.length) {
    return { selectedId: tryOnProducts[0]!.id, applied: {} };
  }
  const wanted = params.get("shade") ?? "";
  const shade = product.shades.includes(wanted) ? wanted : product.shades[0]!;
  return {
    selectedId: product.id,
    applied: { [areaOf(product)]: { productId: product.id, shade } },
  };
}

export default function TryOn() {
  usePageTitle("Virtual try-on");
  const { data: products = [], isPending, error, refetch } = useProducts();
  const tryOnProducts = products.filter((p) => isTryOnType(p.type) && p.shades?.length);

  if (isPending) return <Spinner label="Getting the model ready…" />;
  if (error) return <div className="mx-auto max-w-xl px-4 py-16"><ErrorState error={error} onRetry={refetch} /></div>;
  if (tryOnProducts.length === 0) {
    return <p className="mx-auto max-w-xl px-4 py-24 text-center text-rose-ink/70">No products to try on right now.</p>;
  }
  return <TryOnStudio tryOnProducts={tryOnProducts} />;
}

function TryOnStudio({ tryOnProducts }: { tryOnProducts: Product[] }) {
  const [params] = useSearchParams();
  const [initial] = useState(() => initialLook(params, tryOnProducts));
  const byId = new Map(tryOnProducts.map((p) => [p.id, p]));
  const find = (id: number) => byId.get(id);
  const [toneIndex, setToneIndex] = useState(1);
  const [selectedId, setSelectedId] = useState(initial.selectedId);
  const [applied, setApplied] = useState<Applied>(initial.applied);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const selected = find(selectedId) ?? tryOnProducts[0]!;
  const area = areaOf(selected);
  const current = applied[area];
  const activeShade = current?.productId === selected.id ? current.shade : null;

  const applyShade = (shade: string) => {
    setApplied((a) => ({ ...a, [area]: { productId: selected.id, shade } }));
    setAdded(false);
  };

  const removeArea = (key: Area) => {
    setApplied((a) => {
      const next = { ...a };
      delete next[key];
      return next;
    });
    setAdded(false);
  };

  const lookItems = (Object.keys(applied) as Area[]).flatMap((key) => {
    const product = find(applied[key]!.productId);
    return product ? [{ area: key, shade: applied[key]!.shade, product }] : [];
  });

  const addLook = () => {
    lookItems.forEach((item) => addItem(item.product, item.shade));
    setAdded(true);
  };

  const lipsProduct = applied.lips && find(applied.lips.productId);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm uppercase tracking-[0.25em] text-rose">Virtual try-on</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">Try before you buy</h1>
      <p className="mt-3 max-w-xl text-rose-ink/70">
        Pick a lip or cheek product, tap a shade and see it on the model. Mix a lipstick with a blush to build your look.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,420px)_1fr]">
        {/* المعاينة */}
        <div>
          <div className="mx-auto aspect-[300/330] max-w-sm">
            <FaceModel
              tone={SKIN_TONES[toneIndex]}
              lips={applied.lips?.shade}
              cheeks={applied.cheeks?.shade}
              glossy={lipsProduct?.type === "gloss"}
            />
          </div>
          <div className="mt-6">
            <p className="mb-3 text-center text-sm font-medium">Skin tone</p>
            <div className="flex justify-center gap-3">
              {SKIN_TONES.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setToneIndex(i)}
                  aria-label={`${t.name} skin tone`}
                  aria-pressed={toneIndex === i}
                  className={`h-9 w-9 rounded-full border-2 transition ${toneIndex === i ? "scale-110 border-rose-ink" : "border-white shadow"}`}
                  style={{ backgroundColor: t.skin }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* التحكم */}
        <div>
          <p className="mb-3 text-sm font-medium">Product</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {tryOnProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                aria-pressed={selectedId === p.id}
                className={`flex items-center gap-3 rounded-card border-2 bg-white p-3 text-left transition ${
                  selectedId === p.id ? "border-rose" : "border-blush-200 hover:border-petal"
                }`}
              >
                <ProductImage product={p} className="h-14 w-14 shrink-0 rounded-xl bg-blush-50 p-1" />
                <span>
                  <span className="block font-display leading-snug">{p.name}</span>
                  <span className="text-sm text-rose-ink/60">{formatPrice(p.price)}</span>
                </span>
              </button>
            ))}
          </div>

          <p className="mb-3 mt-8 text-sm font-medium">Shade</p>
          <div className="flex flex-wrap gap-3">
            {(selected.shades ?? []).map((s) => (
              <button
                key={s}
                onClick={() => applyShade(s)}
                aria-label={`Apply shade ${s}`}
                aria-pressed={activeShade === s}
                className={`h-11 w-11 rounded-full border-2 transition hover:scale-110 ${activeShade === s ? "scale-110 border-rose-ink" : "border-white shadow"}`}
                style={{ backgroundColor: s }}
              />
            ))}
          </div>

          {/* الإطلالة الحالية */}
          <div className="mt-10 rounded-card border border-blush-200 bg-white p-5">
            <h2 className="font-display text-2xl">Your look</h2>
            {lookItems.length === 0 ? (
              <p className="mt-2 text-sm text-rose-ink/60">Tap a shade to start.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {lookItems.map((item) => (
                  <li key={item.area} className="flex items-center gap-3">
                    <span className="h-6 w-6 shrink-0 rounded-full" style={{ backgroundColor: item.shade }} />
                    <span className="flex-1 text-sm">
                      <span className="capitalize text-rose-ink/60">{item.area}: </span>
                      <Link to={`/product/${item.product.id}`} className="font-medium hover:text-rose">
                        {item.product.name}
                      </Link>
                    </span>
                    <button onClick={() => removeArea(item.area)} className="text-sm text-rose-ink/50 hover:text-rose-dark">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {lookItems.length > 0 &&
              (added ? (
                <Link to="/cart" className="mt-5 block rounded-full bg-rose-ink py-3 text-center font-medium text-white">
                  Added ✓ View bag
                </Link>
              ) : (
                <button onClick={addLook} className="mt-5 w-full rounded-full bg-rose py-3 font-medium text-white hover:bg-rose-dark">
                  Add this look to bag
                </button>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
