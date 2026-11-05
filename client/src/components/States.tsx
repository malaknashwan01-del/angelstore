import { ApiError } from "../lib/api";

export function ProductGridSkeleton({ count = 8, className = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" }) {
  return (
    <div className={`grid gap-4 ${className}`} aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="overflow-hidden rounded-card border border-blush-200 bg-white">
          <div className="aspect-square animate-pulse bg-blush-100" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/3 animate-pulse rounded bg-blush-100" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-blush-100" />
            <div className="h-4 w-1/4 animate-pulse rounded bg-blush-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-rose-ink/60" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-petal border-t-rose" />
      {label}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const message = error instanceof ApiError ? error.message : "Something went wrong.";
  return (
    <div className="rounded-card bg-blush-50 p-10 text-center" role="alert">
      <p className="font-display text-2xl">We couldn't load this</p>
      <p className="mt-2 text-sm text-rose-ink/60">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-5 rounded-full bg-rose px-6 py-2.5 text-sm font-medium text-white hover:bg-rose-dark">
          Try again
        </button>
      )}
    </div>
  );
}

/** رسالة خطأ للحقل من السيرفر أو من التحقق المحلي */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="text-xs text-rose-dark">{message}</span>;
}
