import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CATEGORIES } from "../data/categories";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import { ErrorState, ProductGridSkeleton } from "../components/States";
import { usePageTitle } from "../lib/usePageTitle";
import type { Category, ShopSort } from "../types";

const SORTS: { value: ShopSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

const isCategory = (v: string | null): v is Category => CATEGORIES.some((c) => c.slug === v);
const isSort = (v: string | null): v is ShopSort => SORTS.some((s) => s.value === v);

/** بيأخر القيمة شوي عشان ما نبعت طلب للسيرفر مع كل حرف */
function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function Shop() {
  usePageTitle("Shop");
  // الفلاتر محفوظة بالرابط، فلو بعتت الرابط لحدا بيشوف نفس النتائج
  const [params, setParams] = useSearchParams();
  const rawCategory = params.get("category");
  const category = isCategory(rawCategory) ? rawCategory : undefined;
  const rawSort = params.get("sort");
  const sort = isSort(rawSort) ? rawSort : "featured";
  const query = params.get("q") ?? "";
  const debouncedQuery = useDebounced(query.trim());

  const { data: products = [], isPending, isFetching, error, refetch } = useProducts({
    category,
    sort,
    q: debouncedQuery || undefined,
  });

  const updateParam = (key: string, value: string, defaultValue: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === defaultValue) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const tabs = [{ slug: "all", label: "All" }, ...CATEGORIES];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl sm:text-5xl">Shop</h1>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist">
          {tabs.map((tab) => {
            const active = (category ?? "all") === tab.slug;
            return (
              <button
                key={tab.slug}
                role="tab"
                aria-selected={active}
                onClick={() => updateParam("category", tab.slug, "all")}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  active ? "bg-rose text-white" : "bg-blush-100 hover:bg-blush-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => updateParam("q", e.target.value, "")}
            placeholder="Search products…"
            aria-label="Search products"
            className="w-full rounded-full border border-blush-200 bg-white px-4 py-2 text-sm outline-none focus:border-rose md:w-56"
          />
          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value, "featured")}
            aria-label="Sort products"
            className="rounded-full border border-blush-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isPending ? (
        <div className="mt-10">
          <ProductGridSkeleton />
        </div>
      ) : error ? (
        <div className="mt-10">
          <ErrorState error={error} onRetry={refetch} />
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-rose-ink/60" aria-live="polite">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
          {products.length > 0 ? (
            <div
              className={`mt-4 grid grid-cols-2 gap-4 transition-opacity md:grid-cols-3 lg:grid-cols-4 ${isFetching ? "opacity-60" : ""}`}
            >
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-card bg-blush-50 p-10 text-center">
              <p className="font-display text-2xl">No products found</p>
              <button onClick={() => setParams({})} className="mt-4 text-sm font-medium text-rose hover:underline">
                Clear filters
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
