import { useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMe } from "../hooks/useAuth";
import { useDeleteReview, useReviews, useSaveReview } from "../hooks/useReviews";
import { ApiError } from "../lib/api";
import Stars from "./Stars";
import { FieldError, Spinner } from "./States";
import type { Product, Review } from "../types";

const dateFormat = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" });

function ReviewForm({ productId, existing, onDone }: { productId: number; existing?: Review; onDone: () => void }) {
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [hover, setHover] = useState(0);
  const [body, setBody] = useState(existing?.body ?? "");
  const save = useSaveReview(productId);
  const fields = save.error instanceof ApiError ? save.error.fields : {};

  const submit = (e: FormEvent) => {
    e.preventDefault();
    save.mutate({ rating, body }, { onSuccess: onDone });
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-card border border-blush-200 bg-white p-5">
      <fieldset>
        <legend className="mb-2 text-sm font-medium">Your rating</legend>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={rating === n}
              className={`text-3xl leading-none transition-transform hover:scale-110 ${n <= (hover || rating) ? "text-rose" : "text-blush-200"}`}
            >
              ★
            </button>
          ))}
        </div>
        <FieldError message={fields.rating} />
      </fieldset>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Your review</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="How did it work for you?"
          className="rounded-xl border border-blush-200 px-4 py-3 outline-none focus:border-rose"
        />
        <FieldError message={fields.body} />
      </label>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={save.isPending}
          className="rounded-full bg-rose px-6 py-2.5 text-sm font-medium text-white hover:bg-rose-dark disabled:opacity-60"
        >
          {save.isPending ? "Saving…" : existing ? "Update review" : "Post review"}
        </button>
        <button type="button" onClick={onDone} className="text-sm text-rose-ink/60 hover:text-rose">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function Reviews({ product }: { product: Product }) {
  const { data: user } = useMe();
  const { data: reviews = [], isPending } = useReviews(product.id);
  const remove = useDeleteReview(product.id);
  const [writing, setWriting] = useState(false);
  const location = useLocation();

  const mine = user ? reviews.find((r) => r.userId === user.id) : undefined;

  return (
    <section id="reviews" className="mt-20 scroll-mt-28">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl">Reviews</h2>
          {product.reviews > 0 && (
            <p className="mt-2 flex items-center gap-2 text-sm text-rose-ink/70">
              <Stars value={product.rating} /> {product.rating} out of 5 · {product.reviews} reviews
            </p>
          )}
        </div>

        {!writing &&
          (user ? (
            <button
              onClick={() => setWriting(true)}
              className="rounded-full border border-rose px-5 py-2 text-sm font-medium text-rose hover:bg-blush-100"
            >
              {mine ? "Edit your review" : "Write a review"}
            </button>
          ) : (
            <Link
              to={`/login?next=${encodeURIComponent(location.pathname + "#reviews")}`}
              className="text-sm font-medium text-rose hover:underline"
            >
              Sign in to write a review
            </Link>
          ))}
      </div>

      {writing && (
        <div className="mt-6">
          <ReviewForm productId={product.id} existing={mine} onDone={() => setWriting(false)} />
        </div>
      )}

      {isPending ? (
        <Spinner label="Loading reviews…" />
      ) : reviews.length === 0 ? (
        <p className="mt-6 rounded-card bg-blush-50 p-6 text-center text-rose-ink/70">Be the first to review this product.</p>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-card border border-blush-200 bg-white p-5">
              <div className="flex items-center justify-between gap-2">
                <Stars value={r.rating} />
                <time className="text-xs text-rose-ink/50" dateTime={r.createdAt}>
                  {dateFormat.format(new Date(r.createdAt))}
                </time>
              </div>
              <p className="mt-3 leading-relaxed">{r.body}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-medium text-rose-ink/70">{r.author}{r.userId === user?.id && " (you)"}</span>
                {r.userId === user?.id && (
                  <button
                    onClick={() => remove.mutate()}
                    disabled={remove.isPending}
                    className="text-rose-ink/50 hover:text-rose-dark"
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
