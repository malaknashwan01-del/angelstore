import { Link, Navigate, useLocation } from "react-router-dom";
import { usePageTitle } from "../lib/usePageTitle";

export default function OrderSuccess() {
  usePageTitle("Order placed");
  const { state } = useLocation();
  if (!state?.orderId) return <Navigate to="/" replace />;

  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blush-100 text-4xl text-rose">
        ✓
      </div>
      <h1 className="mt-6 font-display text-4xl">
        Thank you, {state.name.split(" ")[0]}!
      </h1>
      <p className="mt-3 text-rose-ink/70">
        Your order <b>{state.orderId}</b> has been placed.
      </p>
      <Link
        to="/shop"
        className="mt-8 inline-block rounded-full bg-rose px-8 py-3 font-medium text-white hover:bg-rose-dark"
      >
        Keep shopping
      </Link>
    </section>
  );
}
