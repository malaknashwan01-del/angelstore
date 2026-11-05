interface QuantityPickerProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function QuantityPicker({ value, onChange, min = 1, max = 10 }: QuantityPickerProps) {
  const btn =
    "grid h-10 w-10 place-items-center text-lg transition-colors hover:bg-blush-100 disabled:opacity-30";
  return (
    <div className="inline-flex items-center overflow-hidden rounded-full border border-blush-200 bg-white">
      <button className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        −
      </button>
      <span className="w-8 text-center font-medium" aria-live="polite">{value}</span>
      <button className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}
