// شعار AngelStore: حرف A بهالة ملاك فوقه
export function LogoMark({ className = "h-9 w-9" }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <circle cx="20" cy="24" r="15.5" fill="#e75a8a" />
      {/* الهالة */}
      <ellipse cx="20" cy="6.5" rx="8.5" ry="2.8" fill="none" stroke="#d99a3d" strokeWidth="2.6" />
      {/* حرف A */}
      <path
        d="M13.5 32 L20 16 L26.5 32 M16.2 26.5 H23.8"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({ size = "text-2xl", markClass = "h-9 w-9" }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark className={markClass} />
      <span className={`font-display font-bold text-rose-dark ${size}`}>
        Angel<span className="font-medium italic text-rose">Store</span>
      </span>
    </span>
  );
}
