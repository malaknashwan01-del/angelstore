/** نجوم التقييم — بتعرض نص نجمة كمان (4.5 مثلاً) */
export default function Stars({ value, size = "text-base" }: { value: number; size?: string }) {
  const pct = Math.max(0, Math.min(5, value)) * 20;
  return (
    <span className={`relative inline-block leading-none ${size}`} aria-label={`${value} out of 5 stars`} role="img">
      <span className="text-blush-200">★★★★★</span>
      <span className="absolute inset-0 overflow-hidden text-rose" style={{ width: `${pct}%` }} aria-hidden="true">
        ★★★★★
      </span>
    </span>
  );
}
