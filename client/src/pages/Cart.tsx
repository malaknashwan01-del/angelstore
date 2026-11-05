import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useProductMap } from "../hooks/useProducts";
import { Spinner } from "../components/States";
import ProductImage from "../components/ProductImage";
import QuantityPicker from "../components/QuantityPicker";
import OrderSummary from "../components/OrderSummary";
import { formatPrice } from "../lib/format";
import { usePageTitle } from "../lib/usePageTitle";

export default function Cart() {
  usePageTitle("Your bag");
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const { map, isPending } = useProductMap();

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl">Your bag is empty</h1>
        <p className="mt-3 text-rose-ink/60">Find something you'll love.</p>
        <Link
          to="/shop"
          className="mt-8 inline-block rounded-full bg-rose px-8 py-3 font-medium text-white hover:bg-rose-dark"
        >
          Start shopping
        </Link>
      </section>
    );
  }

  if (isPending) return <Spinner label="Loading your bag…" />;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl sm:text-5xl">Your bag</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="divide-y divide-blush-200 rounded-card border border-blush-200 bg-white">
          {items.map((item) => {
            const product = map.get(item.id);
            if (!product) {
              return (
                <li key={item.key} className="flex items-center justify-between gap-4 p-4 text-sm">
                  <span>
                    <b>{item.name}</b> is no longer available.
                  </span>
                  <button onClick={() => removeItem(item.key)} className="text-rose-dark hover:underline">
                    Remove
                  </button>
                </li>
              );
            }
            return (
              <li key={item.key} className="flex gap-4 p-4">
                <Link to={`/product/${item.id}`} className="shrink-0 rounded-xl bg-blush-50">
                  <ProductImage
                    product={product}
                    color={product.type === "palette" ? undefined : item.shade ?? undefined}
                    className="h-24 w-24 p-2"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <Link to={`/product/${item.id}`} className="font-display text-lg leading-snug hover:text-rose">
                      {item.name}
                    </Link>
                    <span className="font-bold">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                  {item.shade && (
                    <span className="mt-1 flex items-center gap-2 text-sm text-rose-ink/60">
                      Shade
                      <span className="inline-block h-4 w-4 rounded-full" style={{ backgroundColor: item.shade }} />
                    </span>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <QuantityPicker
                      value={item.quantity}
                      min={0}
                      onChange={(q) => updateQuantity(item.key, q)}
                    />
                    <button
                      onClick={() => removeItem(item.key)}
                      className="text-sm text-rose-ink/60 hover:text-rose-dark"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <OrderSummary>
          <Link
            to="/checkout"
            className="mt-6 block rounded-full bg-rose py-3 text-center font-medium text-white hover:bg-rose-dark"
          >
            Checkout
          </Link>
        </OrderSummary>
      </div>
    </section>
  );
}
