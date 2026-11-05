import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
import { useCreateOrder } from "../hooks/useOrders";
import { useMe } from "../hooks/useAuth";
import { ApiError } from "../lib/api";
import type { User } from "../types";
import { validate, type FieldName, type Values } from "../lib/checkoutValidation";
import OrderSummary from "../components/OrderSummary";
import { usePageTitle } from "../lib/usePageTitle";

const FIELDS: { name: FieldName; label: string; type?: string; autoComplete: string; wide?: boolean }[] = [
  { name: "fullName", label: "Full name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "address", label: "Street address", autoComplete: "street-address", wide: true },
];

const emptyFor = (user?: User | null): Values => ({
  fullName: user?.name ?? "",
  email: user?.email ?? "",
  phone: "",
  city: "",
  address: "",
});

export default function Checkout() {
  usePageTitle("Checkout");
  const { data: user } = useMe();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();
  // الاسم والإيميل بيتعبوا من الحساب
  const [values, setValues] = useState(() => emptyFor(user));
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const createOrder = useCreateOrder();

  // أخطاء التحقق المحلي + أخطاء السيرفر (shipping.email → email)
  const serverFields = createOrder.error instanceof ApiError ? createOrder.error.fields : {};
  const serverErrors = Object.fromEntries(
    Object.entries(serverFields).map(([k, v]) => [k.replace("shipping.", ""), v])
  ) as Partial<Record<FieldName, string>>;
  const errors = { ...serverErrors, ...validate(values) };

  if (items.length === 0 && !createOrder.isSuccess) return <Navigate to="/cart" replace />;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleBlur = (e: FocusEvent<HTMLInputElement>) =>
    setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(Object.fromEntries(FIELDS.map((f) => [f.name, true])));
    if (Object.keys(errors).length > 0) return;

    createOrder.mutate(
      {
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity, shade: i.shade })),
        shipping: values,
      },
      {
        onSuccess: (order) => {
          clearCart();
          navigate(`/order-success?id=${order.id}`, { replace: true });
        },
      }
    );
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-4xl sm:text-5xl">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid gap-5 rounded-card border border-blush-200 bg-white p-6 sm:grid-cols-2"
        >
          <h2 className="font-display text-2xl sm:col-span-2">Delivery details</h2>
          {FIELDS.map((f) => {
            const error = touched[f.name] && errors[f.name];
            return (
              <label key={f.name} className={`flex flex-col gap-1.5 text-sm ${f.wide ? "sm:col-span-2" : ""}`}>
                <span className="font-medium">{f.label}</span>
                <input
                  name={f.name}
                  type={f.type ?? "text"}
                  autoComplete={f.autoComplete}
                  value={values[f.name]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={Boolean(error)}
                  className={`rounded-xl border px-4 py-3 outline-none transition-colors focus:border-rose ${
                    error ? "border-rose-dark bg-blush-50" : "border-blush-200"
                  }`}
                />
                {error && <span className="text-xs text-rose-dark">{error}</span>}
              </label>
            );
          })}

          <p className="rounded-xl bg-blush-50 p-4 text-sm text-rose-ink/70 sm:col-span-2">
            💳 Payment: cash on delivery. Prices and shipping are confirmed by our server when you place the order.
          </p>

          {createOrder.error && Object.keys(serverFields).length === 0 && (
            <p role="alert" className="rounded-xl border border-rose-dark/30 bg-blush-50 p-4 text-sm text-rose-dark sm:col-span-2">
              {createOrder.error.message}
            </p>
          )}

          <button
            type="submit"
            disabled={createOrder.isPending}
            className="rounded-full bg-rose py-3 font-medium text-white transition-colors hover:bg-rose-dark disabled:opacity-60 sm:col-span-2"
          >
            {createOrder.isPending ? "Placing order…" : "Place order"}
          </button>
        </form>

        <OrderSummary />
      </div>
    </section>
  );
}
