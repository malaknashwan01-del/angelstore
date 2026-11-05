import { useState } from "react";
import { Link } from "react-router-dom";
import { QUESTIONS, buildRoutine, type Answers } from "../data/quiz";
import { useCartStore } from "../store/cartStore";
import ProductImage from "../components/ProductImage";
import { formatPrice } from "../lib/format";
import { usePageTitle } from "../lib/usePageTitle";

export default function Quiz() {
  usePageTitle("Skin quiz");
  const [step, setStep] = useState(0); // رقم السؤال الحالي
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const done = step === QUESTIONS.length;

  const choose = (questionId: keyof Answers, value: string) => {
    setAnswers((a) => ({ ...a, [questionId]: value }));
    setStep((s) => s + 1);
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setAdded(false);
  };

  if (done) {
    const complete = answers as Answers; // كل الأسئلة انجاوبت هون
    const routine = buildRoutine(complete);
    const total = routine.reduce((sum, r) => sum + r.product.price, 0);
    const skinLabel = QUESTIONS[0]!.options.find((o) => o.value === complete.skinType)?.hint ?? "";

    const addRoutine = () => {
      routine.forEach((r) => addItem(r.product));
      setAdded(true);
    };

    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm uppercase tracking-[0.25em] text-rose">Your results</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">
          Your {skinLabel.toLowerCase()} skin routine
        </h1>
        <p className="mt-3 text-rose-ink/70">
          {routine.length} steps picked for your skin type and goals.
        </p>

        <ol className="mt-8 space-y-3">
          {routine.map((r, i) => (
            <li key={r.key} className="flex items-center gap-4 rounded-card border border-blush-200 bg-white p-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blush-100 font-display text-rose-dark">
                {i + 1}
              </span>
              <Link to={`/product/${r.product.id}`} className="shrink-0 rounded-xl bg-blush-50">
                <ProductImage product={r.product} className="h-20 w-20 p-2" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-rose">
                  {r.label} · <span className="font-medium text-rose-ink/50">{r.when}</span>
                </p>
                <Link to={`/product/${r.product.id}`} className="font-display text-lg leading-snug hover:text-rose">
                  {r.product.name}
                </Link>
              </div>
              <span className="font-bold">{formatPrice(r.product.price)}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col items-stretch gap-3 rounded-card bg-blush-100 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-rose-ink/70">Full routine</p>
            <p className="font-display text-3xl">{formatPrice(total)}</p>
          </div>
          {added ? (
            <Link to="/cart" className="rounded-full bg-rose-ink px-8 py-3 text-center font-medium text-white">
              Added ✓ View bag
            </Link>
          ) : (
            <button onClick={addRoutine} className="rounded-full bg-rose px-8 py-3 font-medium text-white hover:bg-rose-dark">
              Add routine to bag
            </button>
          )}
        </div>

        <button onClick={restart} className="mt-6 text-sm font-medium text-rose hover:underline">
          ↺ Retake the quiz
        </button>
      </section>
    );
  }

  const question = QUESTIONS[step]!;
  const progress = (step / QUESTIONS.length) * 100;

  return (
    <section className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-sm uppercase tracking-[0.25em] text-rose">Skin quiz</p>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-blush-100">
          <div className="h-full rounded-full bg-rose transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-sm text-rose-ink/60">
          {step + 1} / {QUESTIONS.length}
        </span>
      </div>

      <h1 key={question.id} className="mt-8 font-display text-3xl sm:text-4xl">
        {question.title}
      </h1>

      <div className="mt-8 grid gap-3">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => choose(question.id, opt.value)}
            className={`flex items-center justify-between rounded-card border-2 bg-white px-5 py-4 text-left transition hover:border-rose hover:bg-blush-50 ${
              answers[question.id] === opt.value ? "border-rose" : "border-blush-200"
            }`}
          >
            <span className="font-medium">{opt.label}</span>
            {opt.hint && <span className="text-sm text-rose">{opt.hint}</span>}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button onClick={() => setStep((s) => s - 1)} className="mt-6 text-sm font-medium text-rose-ink/60 hover:text-rose">
          ← Back
        </button>
      )}
    </section>
  );
}
