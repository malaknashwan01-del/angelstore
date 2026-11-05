import type { ReactNode } from "react";
import { useCartStore, selectSubtotal } from "../store/cartStore";
import { formatPrice, getShipping, FREE_SHIPPING_FROM } from "../lib/format";

export default function OrderSummary({ children }: { children?: ReactNode }) {
  const subtotal = useCartStore(selectSubtotal);
  const shipping = getShipping(subtotal);
  const remaining = FREE_SHIPPING_FROM - subtotal;

  return (
    <aside className="h-fit rounded-card border border-blush-200 bg-white p-6">
      <h2 className="font-display text-2xl">Summary</h2>

      {remaining > 0 && (
        <div className="mt-4">
          <p className="text-sm text-rose-ink/70">
            Add <b>{formatPrice(remaining)}</b> more for free shipping
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-blush-100">
            <div
              className="h-full rounded-full bg-rose transition-all"
              style={{ width: `${(subtotal / FREE_SHIPPING_FROM) * 100}%` }}
            />
          </div>
        </div>
      )}

      <dl className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-blush-200 pt-3 text-base font-bold">
          <dt>Total</dt>
          <dd>{formatPrice(subtotal + shipping)}</dd>
        </div>
      </dl>
      {children}
    </aside>
  );
}
