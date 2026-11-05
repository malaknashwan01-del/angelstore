import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useLogin, useMe, useRegister } from "../hooks/useAuth";
import { ApiError } from "../lib/api";
import { FieldError } from "../components/States";
import { usePageTitle } from "../lib/usePageTitle";

/** صفحة واحدة لتسجيل الدخول وإنشاء حساب */
export default function Login({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  usePageTitle(isRegister ? "Create account" : "Sign in");
  const [params] = useSearchParams();
  // بنرجّع المستخدم للصفحة اللي كان فيها — بس لروابط داخل الموقع
  const rawNext = params.get("next") ?? "/account";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/account";

  const { data: user } = useMe();
  const login = useLogin();
  const register = useRegister();
  const mutation = isRegister ? register : login;
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user && !mutation.isSuccess) return <Navigate to={next} replace />;

  const fields = mutation.error instanceof ApiError ? mutation.error.fields : {};
  const formError = mutation.error && Object.keys(fields).length === 0 ? mutation.error.message : null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const onSuccess = () => navigate(next, { replace: true });
    if (isRegister) register.mutate({ name, email, password }, { onSuccess });
    else login.mutate({ email, password }, { onSuccess });
  };

  const input = "rounded-xl border border-blush-200 bg-white px-4 py-3 outline-none focus:border-rose";
  const switchLink = `${isRegister ? "/login" : "/register"}${params.get("next") ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-4xl">{isRegister ? "Create your account" : "Welcome back"}</h1>
      <p className="mt-2 text-rose-ink/70">
        {isRegister ? "Save your wishlist, review products and track orders." : "Sign in to your AngelStore account."}
      </p>

      <form onSubmit={submit} noValidate className="mt-8 grid gap-4">
        {isRegister && (
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={input} />
            <FieldError message={fields.name} />
          </label>
        )}
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium">Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" className={input} />
          <FieldError message={fields.email} />
        </label>
        <div className="flex flex-col gap-1.5 text-sm">
          <label htmlFor="password" className="font-medium">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isRegister ? "new-password" : "current-password"}
            aria-describedby={isRegister ? "password-hint" : undefined}
            className={input}
          />
          <FieldError message={fields.password} />
          {isRegister && !fields.password && (
            <span id="password-hint" className="text-xs text-rose-ink/50">At least 8 characters</span>
          )}
        </div>

        {formError && (
          <p role="alert" className="rounded-xl bg-blush-50 p-3 text-sm text-rose-dark">
            {formError}
          </p>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="mt-2 rounded-full bg-rose py-3 font-medium text-white hover:bg-rose-dark disabled:opacity-60"
        >
          {mutation.isPending ? "Please wait…" : isRegister ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-rose-ink/70">
        {isRegister ? "Already have an account?" : "New to AngelStore?"}{" "}
        <Link to={switchLink} className="font-medium text-rose hover:underline">
          {isRegister ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </section>
  );
}
