import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAdminOrders, useDeleteProduct, useSaveProduct, useUpdateOrderStatus } from "../hooks/useAdmin";
import { useProducts } from "../hooks/useProducts";
import ProductImage from "../components/ProductImage";
import OrderCard from "../components/OrderCard";
import { ErrorState, FieldError, Spinner } from "../components/States";
import { CATEGORIES } from "../data/categories";
import { ApiError } from "../lib/api";
import { formatPrice } from "../lib/format";
import { usePageTitle } from "../lib/usePageTitle";
import type { OrderStatus, Product, ProductInput, ProductType } from "../types";

const TYPES: ProductType[] = [
  "lipstick", "gloss", "blush", "compact", "palette", "mascara", "foundation",
  "toner", "serum", "dropper", "pump", "jar", "tube", "balm",
];
const STATUSES: OrderStatus[] = ["placed", "shipped", "delivered", "cancelled"];

const blank: ProductInput = {
  name: "",
  brand: "",
  category: "makeup",
  type: "lipstick",
  color: "#e75a8a",
  price: 0,
  description: "",
  bestseller: false,
  shades: [],
};

const toInput = ({ id: _id, rating: _r, reviews: _v, ...rest }: Product): ProductInput => ({ ...rest, shades: rest.shades ?? [] });

/* ---------------- Product form ---------------- */

function ProductForm({ product, onClose }: { product?: Product; onClose: () => void }) {
  const [form, setForm] = useState<ProductInput>(() => (product ? toInput(product) : blank));
  const save = useSaveProduct();
  const fields = save.error instanceof ApiError ? save.error.fields : {};
  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => setForm((f) => ({ ...f, [key]: value }));
  const shades = form.shades ?? [];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    save.mutate({ id: product?.id, input: form }, { onSuccess: onClose });
  };

  const input = "rounded-xl border border-blush-200 bg-white px-3 py-2.5 outline-none focus:border-rose";
  const preview = { ...form, id: product?.id ?? 0, rating: 0, reviews: 0 } as Product;

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 rounded-card border border-blush-200 bg-white p-6 md:grid-cols-[200px_1fr]">
      <div className="text-center">
        <div className="rounded-card bg-blush-50 p-4">
          <ProductImage product={preview} className="mx-auto w-full" />
        </div>
        <p className="mt-2 text-xs text-rose-ink/50">Live preview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <h2 className="font-display text-2xl sm:col-span-2">{product ? `Edit “${product.name}”` : "New product"}</h2>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium">Name</span>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={input} />
          <FieldError message={fields.name} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Brand</span>
          <input value={form.brand} onChange={(e) => set("brand", e.target.value)} className={input} />
          <FieldError message={fields.brand} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Price ($)</span>
          <input
            type="number"
            min="0"
            step="0.5"
            value={form.price || ""}
            onChange={(e) => set("price", Number(e.target.value))}
            className={input}
          />
          <FieldError message={fields.price} />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Category</span>
          <select value={form.category} onChange={(e) => set("category", e.target.value as ProductInput["category"])} className={input}>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.label}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Illustration</span>
          <select value={form.type} onChange={(e) => set("type", e.target.value as ProductType)} className={`${input} capitalize`}>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Packaging color</span>
          <span className="flex items-center gap-2">
            <input type="color" value={form.color} onChange={(e) => set("color", e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-blush-200" aria-label="Packaging color picker" />
            <input value={form.color} onChange={(e) => set("color", e.target.value)} className={`${input} w-full font-mono`} aria-label="Packaging color hex" />
          </span>
          <FieldError message={fields.color} />
        </label>
        <label className="flex items-center gap-3 self-end pb-3 text-sm font-medium">
          <input type="checkbox" checked={form.bestseller} onChange={(e) => set("bestseller", e.target.checked)} className="h-5 w-5 accent-rose" />
          Bestseller
        </label>

        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-medium">Shades <span className="font-normal text-rose-ink/50">(optional, up to 8)</span></legend>
          <div className="flex flex-wrap items-center gap-2">
            {shades.map((s, i) => (
              <span key={i} className="flex items-center gap-1 rounded-full border border-blush-200 py-1 pl-1 pr-2">
                <input
                  type="color"
                  value={s}
                  onChange={(e) => set("shades", shades.map((x, j) => (j === i ? e.target.value : x)))}
                  className="h-7 w-7 cursor-pointer rounded-full"
                  aria-label={`Shade ${i + 1}`}
                />
                <button type="button" onClick={() => set("shades", shades.filter((_, j) => j !== i))} aria-label={`Remove shade ${i + 1}`} className="text-rose-ink/50 hover:text-rose-dark">
                  ×
                </button>
              </span>
            ))}
            {shades.length < 8 && (
              <button type="button" onClick={() => set("shades", [...shades, form.color])} className="rounded-full border border-dashed border-rose px-3 py-1.5 text-sm text-rose">
                + Add shade
              </button>
            )}
          </div>
          <FieldError message={Object.entries(fields).find(([k]) => k.startsWith("shades"))?.[1]} />
        </fieldset>

        <label className="flex flex-col gap-1.5 text-sm sm:col-span-2">
          <span className="font-medium">Description</span>
          <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className={input} />
          <FieldError message={fields.description} />
        </label>

        {save.error && Object.keys(fields).length === 0 && (
          <p role="alert" className="text-sm text-rose-dark sm:col-span-2">{save.error.message}</p>
        )}

        <div className="flex gap-3 sm:col-span-2">
          <button type="submit" disabled={save.isPending} className="rounded-full bg-rose px-8 py-3 font-medium text-white hover:bg-rose-dark disabled:opacity-60">
            {save.isPending ? "Saving…" : product ? "Save changes" : "Create product"}
          </button>
          <button type="button" onClick={onClose} className="rounded-full px-6 py-3 font-medium text-rose-ink/70 hover:bg-blush-50">
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

/* ---------------- Products tab ---------------- */

function ProductsTab() {
  const { data: products = [], isPending, error, refetch } = useProducts();
  const remove = useDeleteProduct();
  const [editing, setEditing] = useState<Product | "new" | null>(null);

  if (isPending) return <Spinner />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const confirmDelete = (p: Product) => {
    if (window.confirm(`Delete “${p.name}”? Past orders keep their copy.`)) remove.mutate(p.id);
  };

  return (
    <div className="space-y-6">
      {editing ? (
        <ProductForm key={editing === "new" ? "new" : editing.id} product={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} />
      ) : (
        <button onClick={() => setEditing("new")} className="rounded-full bg-rose px-6 py-3 font-medium text-white hover:bg-rose-dark">
          + New product
        </button>
      )}

      <ul className="divide-y divide-blush-200 overflow-hidden rounded-card border border-blush-200 bg-white">
        {products.map((p) => (
          <li key={p.id} className="flex items-center gap-4 p-3 sm:p-4">
            <ProductImage product={p} className="h-14 w-14 shrink-0 rounded-xl bg-blush-50 p-1" />
            <div className="min-w-0 flex-1">
              <Link to={`/product/${p.id}`} className="block truncate font-display text-lg hover:text-rose">{p.name}</Link>
              <p className="text-sm text-rose-ink/60">
                {p.brand} · {p.category === "skincare" ? "Skin care" : "Makeup"}
                {p.bestseller && " · ★ Bestseller"}
              </p>
            </div>
            <span className="hidden font-bold sm:block">{formatPrice(p.price)}</span>
            <div className="flex gap-1">
              <button onClick={() => setEditing(p)} className="rounded-full px-3 py-1.5 text-sm font-medium text-rose hover:bg-blush-50">
                Edit
              </button>
              <button onClick={() => confirmDelete(p)} className="rounded-full px-3 py-1.5 text-sm text-rose-ink/50 hover:bg-blush-50 hover:text-rose-dark">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Orders tab ---------------- */

function OrdersTab() {
  const { data: orders = [], isPending, error, refetch } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  if (isPending) return <Spinner />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Orders", value: orders.length },
          { label: "To ship", value: orders.filter((o) => o.status === "placed").length },
          { label: "Revenue", value: formatPrice(revenue) },
        ].map((s) => (
          <div key={s.label} className="rounded-card bg-blush-100 p-4">
            <p className="text-xs uppercase tracking-wider text-rose-ink/60">{s.label}</p>
            <p className="mt-1 font-display text-2xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            aria-pressed={filter === s}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${filter === s ? "bg-rose text-white" : "bg-blush-100 hover:bg-blush-200"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-card bg-blush-50 p-8 text-center text-rose-ink/70">No orders here yet.</p>
      ) : (
        visible.map((order) => (
          <OrderCard key={order.id} order={order}>
            <select
              value={order.status}
              onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value as OrderStatus })}
              aria-label={`Status for order ${order.id}`}
              className="rounded-full border border-blush-200 bg-white px-3 py-1.5 text-sm capitalize outline-none focus:border-rose"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </OrderCard>
        ))
      )}
    </div>
  );
}

/* ---------------- Page ---------------- */

export default function Admin() {
  usePageTitle("Admin");
  const [tab, setTab] = useState<"products" | "orders">("orders");

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <p className="text-sm uppercase tracking-[0.25em] text-rose">Admin</p>
      <h1 className="mt-2 font-display text-4xl sm:text-5xl">Store dashboard</h1>

      <div className="mt-8 flex gap-2 border-b border-blush-200" role="tablist">
        {(["orders", "products"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2.5 font-medium capitalize transition-colors ${tab === t ? "border-rose text-rose" : "border-transparent hover:text-rose"}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-8">{tab === "products" ? <ProductsTab /> : <OrdersTab />}</div>
    </section>
  );
}
