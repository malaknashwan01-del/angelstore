import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useOrder } from "../hooks/useOrders";
import { ErrorState, Spinner } from "../components/States";
import { formatPrice } from "../lib/format";
import { usePageTitle } from "../lib/usePageTitle";

export default function OrderSuccess() {
  usePageTitle("Order placed");
  const id = Number(useSearchParams()[0].get("id"));
  const { data: order, isPending, error } = useOrder(id);

  if (!Number.isInteger(id) || id <= 0) return <Navigate to="/" replace />;
  if (isPending) return <Spinner />;
  if (error || !order) return <div className="mx-auto max-w-xl px-4 py-16"><ErrorState error={error} /></div>;

  return (
    <section className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blush-100 text-4xl text-rose">✓</div>
      <h1 className="mt-6 font-display text-4xl">
        Thank you, {order.shipping.fullName.split(" ")[0]}!
      </h1>
      <p className="mt-3 text-rose-ink/70">
        Order <b>#{order.id}</b> is confirmed. Total <b>{formatPrice(order.total)}</b>, paid on delivery.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/account" className="rounded-full border border-rose px-8 py-3 font-medium text-rose hover:bg-blush-100">
          View my orders
        </Link>
        <Link to="/shop" className="rounded-full bg-rose px-8 py-3 font-medium text-white hover:bg-rose-dark">
          Keep shopping
        </Link>
      </div>
    </section>
  );
}
