import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/cartStore";
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

const empty = Object.fromEntries(FIELDS.map((f) => [f.name, ""])) as Values;

export default function Checkout() {
  usePageTitle("Checkout");
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();
  const [values, setValues] = useState(empty);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);

  const errors = validate(values);

  if (items.length === 0 && !submitting) return <Navigate to="/cart" replace />;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleBlur = (e: FocusEvent<HTMLInputElement>) =>
    setTouched((t) => ({ ...t, [e.target.name]: true }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(Object.fromEntries(FIELDS.map((f) => [f.name, true])));
    if (Object.keys(errors).length > 0) return;

    // طلب وهمي — بمشروع حقيقي هون بنبعت الطلب للسيرفر
    setSubmitting(true);
    setTimeout(() => {
      const orderId = `AS-${Date.now().toString().slice(-6)}`;
      clearCart();
      navigate("/order-success", { state: { orderId, name: values.fullName } });
    }, 900);
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
            💳 Payment: cash on delivery. This is a demo store, so no real order is placed.
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-rose py-3 font-medium text-white transition-colors hover:bg-rose-dark disabled:opacity-60 sm:col-span-2"
          >
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </form>

        <OrderSummary />
      </div>
    </section>
  );
}
