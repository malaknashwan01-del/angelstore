import type { ComponentType } from "react";
import { getPhoto } from "../data/photos";
import type { Product, ProductType } from "../types";

interface ShapeProps {
  c: string;
  shades: string[];
}

// صورة المنتج مرسومة بـ SVG حسب نوعه ولونه.
// ميزتها: خفيفة جداً، دايماً بتشتغل، وبتطلع بنفس ستايل المتجر.

const INK = "#5a1f36";
const GOLD = "#d9a5a0";
const CAP = "#3d1a28";

function Lipstick({ c }: ShapeProps) {
  return (
    <g>
      <path d="M86 52 L112 40 L112 88 L86 88 Z" fill={c} />
      <rect x="80" y="86" width="40" height="22" rx="3" fill={GOLD} />
      <rect x="74" y="106" width="52" height="66" rx="6" fill={CAP} />
      <rect x="80" y="112" width="6" height="54" rx="3" fill="#fff" opacity=".15" />
    </g>
  );
}

function Gloss({ c }: ShapeProps) {
  return (
    <g>
      <rect x="88" y="24" width="24" height="56" rx="6" fill={CAP} />
      <path d="M82 80 h36 v86 a12 12 0 0 1 -12 12 h-12 a12 12 0 0 1 -12 -12z" fill={c} opacity=".85" />
      <rect x="88" y="88" width="6" height="74" rx="3" fill="#fff" opacity=".35" />
    </g>
  );
}

function Compact({ c, pan = false }: ShapeProps & { pan?: boolean }) {
  return (
    <g>
      <circle cx="100" cy="104" r="64" fill={CAP} />
      <circle cx="100" cy="104" r="56" fill={GOLD} opacity=".5" />
      <circle cx="100" cy="104" r="50" fill={c} />
      {pan ? (
        <path d="M70 92 q30 -20 60 0" stroke="#fff" strokeWidth="4" fill="none" opacity=".35" strokeLinecap="round" />
      ) : (
        <circle cx="100" cy="104" r="34" fill="#fff" opacity=".18" />
      )}
    </g>
  );
}

function Palette({ shades }: ShapeProps) {
  const cells = shades.slice(0, 6);
  return (
    <g>
      <rect x="34" y="52" width="132" height="100" rx="12" fill={CAP} />
      {cells.map((s, i) => (
        <rect
          key={i}
          x={46 + (i % 3) * 38}
          y={64 + Math.floor(i / 3) * 40}
          width="32"
          height="34"
          rx="6"
          fill={s}
        />
      ))}
    </g>
  );
}

function Mascara({ c }: ShapeProps) {
  return (
    <g transform="rotate(-30 100 100)">
      <rect x="88" y="20" width="24" height="70" rx="8" fill={CAP} />
      <rect x="86" y="88" width="28" height="8" rx="2" fill={GOLD} />
      <rect x="86" y="96" width="28" height="84" rx="10" fill={c} />
      <rect x="92" y="102" width="5" height="70" rx="2.5" fill="#fff" opacity=".2" />
    </g>
  );
}

function Bottle({ c, cap = CAP, neck = 16 }: ShapeProps & { cap?: string; neck?: number }) {
  return (
    <g>
      <rect x={100 - neck / 2} y="38" width={neck} height="26" rx="3" fill={cap} />
      <rect x="64" y="62" width="72" height="112" rx="16" fill={c} />
      <rect x="76" y="96" width="48" height="40" rx="4" fill="#fff" opacity=".7" />
      <rect x="82" y="108" width="36" height="4" rx="2" fill={INK} opacity=".35" />
      <rect x="82" y="118" width="24" height="4" rx="2" fill={INK} opacity=".25" />
      <rect x="70" y="70" width="6" height="96" rx="3" fill="#fff" opacity=".3" />
    </g>
  );
}

function Dropper({ c }: ShapeProps) {
  return (
    <g>
      <ellipse cx="100" cy="34" rx="12" ry="14" fill={CAP} />
      <rect x="88" y="40" width="24" height="26" rx="3" fill={GOLD} />
      <rect x="68" y="64" width="64" height="108" rx="14" fill={c} opacity=".9" />
      <rect x="78" y="100" width="44" height="36" rx="4" fill="#fff" opacity=".7" />
      <rect x="84" y="112" width="32" height="4" rx="2" fill={INK} opacity=".35" />
      <rect x="74" y="72" width="6" height="92" rx="3" fill="#fff" opacity=".3" />
    </g>
  );
}

function Pump({ c }: ShapeProps) {
  return (
    <g>
      <path d="M100 30 h28 v10 h-20 v14 h-8z" fill={CAP} />
      <rect x="92" y="52" width="16" height="16" rx="2" fill={CAP} />
      <rect x="64" y="66" width="72" height="108" rx="18" fill={c} stroke={INK} strokeOpacity=".08" />
      <rect x="76" y="100" width="48" height="40" rx="4" fill="#fff" opacity=".8" />
      <circle cx="100" cy="120" r="8" fill="#f7b6cb" />
    </g>
  );
}

function Jar({ c }: ShapeProps) {
  return (
    <g>
      <rect x="46" y="70" width="108" height="30" rx="8" fill={CAP} />
      <rect x="50" y="98" width="100" height="70" rx="14" fill={c} stroke={INK} strokeOpacity=".08" />
      <rect x="70" y="118" width="60" height="28" rx="4" fill="#fff" opacity=".7" />
      <rect x="78" y="128" width="44" height="4" rx="2" fill={INK} opacity=".3" />
    </g>
  );
}

function Tube({ c }: ShapeProps) {
  return (
    <g transform="rotate(-20 100 100)">
      <path d="M72 30 h56 l-8 118 h-40 z" fill={c} stroke={INK} strokeOpacity=".1" />
      <rect x="68" y="24" width="64" height="10" rx="3" fill={c} stroke={INK} strokeOpacity=".15" />
      <rect x="82" y="146" width="36" height="28" rx="4" fill={CAP} />
      <rect x="84" y="70" width="32" height="5" rx="2.5" fill={INK} opacity=".35" />
      <rect x="88" y="82" width="24" height="4" rx="2" fill={INK} opacity=".25" />
    </g>
  );
}

function Balm({ c }: ShapeProps) {
  return (
    <g>
      <rect x="84" y="36" width="32" height="54" rx="6" fill={c} />
      <rect x="82" y="88" width="36" height="84" rx="8" fill="#fff" stroke={INK} strokeOpacity=".12" />
      <rect x="88" y="112" width="24" height="36" rx="3" fill={c} opacity=".4" />
    </g>
  );
}

const SHAPES: Record<ProductType, ComponentType<ShapeProps>> = {
  lipstick: Lipstick,
  gloss: Gloss,
  blush: (p: ShapeProps) => <Compact {...p} pan />,
  compact: Compact,
  palette: Palette,
  mascara: Mascara,
  foundation: (p: ShapeProps) => <Bottle {...p} cap={GOLD} neck={22} />,
  toner: (p: ShapeProps) => <Bottle {...p} />,
  serum: Dropper,
  dropper: Dropper,
  pump: Pump,
  jar: Jar,
  tube: Tube,
  balm: Balm,
};

interface ProductImageProps {
  product: Product;
  /** لون بديل، مثلاً اللون المختار بصفحة المنتج */
  color?: string;
  className?: string;
}

export default function ProductImage({ product, color, className = "" }: ProductImageProps) {
  // إذا في صورة حقيقية للمنتج بنعرضها، وإلا بنرسمه
  const photo = getPhoto(product.id);
  if (photo) {
    return (
      <img
        src={photo}
        alt={product.name}
        loading="lazy"
        // الصورة بتعبي الكرت كامل، فبنشيل الـ padding تبع الرسمة
        className={`${className.replace(/\bp-\d+\b/g, "")} object-cover`}
      />
    );
  }

  const Shape = SHAPES[product.type];
  const c = color ?? product.color;
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={product.name}
      className={className}
    >
      <ellipse cx="100" cy="182" rx="56" ry="7" fill={INK} opacity=".08" />
      <Shape c={c} shades={product.shades ?? [c]} />
    </svg>
  );
}
