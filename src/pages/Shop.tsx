import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { products, CATEGORIES } from "../data/products";
import ProductCard from "../components/ProductCard";
import { usePageTitle } from "../lib/usePageTitle";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

export default function Shop() {
  usePageTitle("Shop");
  // الفلاتر محفوظة بالرابط، فلو بعتت الرابط لحدا بيشوف نفس النتائج
  const [params, setParams] = useSearchParams();
  const category = params.get("category") ?? "all";
  const query = params.get("q") ?? "";
  const sort = params.get("sort") ?? "featured";

  const updateParam = (key: string, value: string, defaultValue: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === defaultValue) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter(
      (p) =>
        (category === "all" || p.category === category) &&
        (!q || `${p.name} ${p.brand}`.toLowerCase().includes(q))
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, query, sort]);

  const tabs = [{ slug: "all", label: "All" }, ...CATEGORIES];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl sm:text-5xl">Shop</h1>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.slug}
              role="tab"
              aria-selected={category === tab.slug}
              onClick={() => updateParam("category", tab.slug, "all")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                category === tab.slug
                  ? "bg-rose text-white"
                  : "bg-blush-100 hover:bg-blush-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
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

      <p className="mt-6 text-sm text-rose-ink/60">
        {visible.length} {visible.length === 1 ? "product" : "products"}
      </p>

      {visible.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-card bg-blush-50 p-10 text-center">
          <p className="font-display text-2xl">No products found</p>
          <button
            onClick={() => setParams({})}
            className="mt-4 text-sm font-medium text-rose hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
