import { Link, useNavigate } from "react-router-dom";
import { useLogout, useMe } from "../hooks/useAuth";
import { useOrders } from "../hooks/useOrders";
import OrderCard from "../components/OrderCard";
import { ErrorState, Spinner } from "../components/States";
import { usePageTitle } from "../lib/usePageTitle";

export default function Account() {
  usePageTitle("My account");
  const { data: user } = useMe();
  const { data: orders = [], isPending, error, refetch } = useOrders();
  const logout = useLogout();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-rose">My account</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Hi, {user.name.split(" ")[0]}</h1>
          <p className="mt-2 text-rose-ink/60">{user.email}</p>
        </div>
        <div className="flex gap-3">
          {user.role === "admin" && (
            <Link to="/admin" className="rounded-full bg-rose-ink px-5 py-2.5 text-sm font-medium text-white">
              Admin dashboard
            </Link>
          )}
          <button
            onClick={() => logout.mutate(undefined, { onSuccess: () => navigate("/") })}
            className="rounded-full border border-blush-200 bg-white px-5 py-2.5 text-sm font-medium hover:bg-blush-100"
          >
            Sign out
          </button>
        </div>
      </div>

      <h2 className="mt-12 font-display text-3xl">My orders</h2>
      <div className="mt-6 space-y-4">
        {isPending ? (
          <Spinner label="Loading orders…" />
        ) : error ? (
          <ErrorState error={error} onRetry={refetch} />
        ) : orders.length === 0 ? (
          <div className="rounded-card bg-blush-50 p-10 text-center">
            <p className="font-display text-2xl">No orders yet</p>
            <Link to="/shop" className="mt-5 inline-block rounded-full bg-rose px-8 py-3 font-medium text-white hover:bg-rose-dark">
              Start shopping
            </Link>
          </div>
        ) : (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        )}
      </div>
    </section>
  );
}
