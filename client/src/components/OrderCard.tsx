import { formatPrice } from "../lib/format";
import type { Order, OrderStatus } from "../types";

const dateFormat = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" });

const STATUS_STYLE: Record<OrderStatus, string> = {
  placed: "bg-blush-100 text-rose-dark",
  shipped: "bg-amber-100 text-amber-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-stone-200 text-stone-600",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${STATUS_STYLE[status]}`}>{status}</span>
  );
}

export default function OrderCard({ order, children }: { order: Order; children?: React.ReactNode }) {
  return (
    <article className="rounded-card border border-blush-200 bg-white p-5">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-display text-xl">Order #{order.id}</h3>
          <p className="text-sm text-rose-ink/60">
            {dateFormat.format(new Date(order.createdAt))}
            {order.customer && ` · ${order.customer.name} (${order.customer.email})`}
          </p>
        </div>
        {children ?? <StatusBadge status={order.status} />}
      </header>
      <ul className="mt-4 space-y-1.5 text-sm">
        {order.items.map((item, i) => (
          <li key={i} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              {item.shade && <span className="inline-block h-3.5 w-3.5 rounded-full" style={{ backgroundColor: item.shade }} />}
              {item.quantity} × {item.name}
            </span>
            <span>{formatPrice(item.unitPrice * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <footer className="mt-4 flex justify-between border-t border-blush-200 pt-3 text-sm">
        <span className="text-rose-ink/60">
          {order.shipping.city} · {order.shippingCost === 0 ? "Free shipping" : `Shipping ${formatPrice(order.shippingCost)}`}
        </span>
        <b>{formatPrice(order.total)}</b>
      </footer>
    </article>
  );
}
