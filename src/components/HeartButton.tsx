import { useWishlistStore } from "../store/wishlistStore";

interface HeartButtonProps {
  productId: number;
  className?: string;
}

export default function HeartButton({ productId, className = "" }: HeartButtonProps) {
  const saved = useWishlistStore((s) => s.ids.includes(productId));
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <button
      type="button"
      onClick={(e) => {
        // الزر جوّا رابط الكرت، فبنمنع فتح صفحة المنتج
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={saved}
      className={`grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm transition hover:scale-110 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5">
        <path
          d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"
          fill={saved ? "#e75a8a" : "none"}
          stroke="#e75a8a"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
