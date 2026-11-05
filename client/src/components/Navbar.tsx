import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCartStore, selectCount } from "../store/cartStore";
import { useMe } from "../hooks/useAuth";
import { useWishlist } from "../hooks/useWishlist";
import Logo from "./Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/quiz", label: "Skin Quiz" },
  { to: "/try-on", label: "Try On" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap transition-colors ${isActive ? "text-rose" : "hover:text-rose"}`;

function Badge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-rose-ink px-1 text-xs text-white">
      {count}
    </span>
  );
}

export default function Navbar() {
  const count = useCartStore(selectCount);
  const { data: user } = useMe();
  const { data: wishlistIds } = useWishlist();
  const saved = wishlistIds?.length ?? 0;
  const accountLink = user
    ? { to: user.role === "admin" ? "/admin" : "/account", label: user.role === "admin" ? "Admin" : "Account" }
    : { to: "/login", label: "Sign in" };
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, search } = useLocation();

  // سكّر القائمة لما المستخدم يتنقل لصفحة ثانية
  const [lastLocation, setLastLocation] = useState(pathname + search);
  if (lastLocation !== pathname + search) {
    setLastLocation(pathname + search);
    setMenuOpen(false);
  }

  // سكّر القائمة بزر Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-20 border-b border-blush-200 bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" aria-label="AngelStore home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <NavLink to={accountLink.to} className={(a) => `hidden text-sm font-medium md:block ${linkClass(a)}`}>
            {accountLink.label}
          </NavLink>
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-blush-200 bg-white transition-colors hover:bg-blush-100"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path
                d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 7 4.5c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.6 0 5.6 3.5 4.3 6.8-1.8 4.6-9.3 9.2-9.3 9.2z"
                fill="none"
                stroke="#c93b6d"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            <Badge count={saved} />
          </Link>
          <Link
            to="/cart"
            className="relative rounded-full bg-rose px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-dark"
          >
            Bag
            <Badge count={count} />
          </Link>

          {/* زر القائمة — بيظهر بس على الشاشات الصغيرة */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-blush-200 bg-white transition-colors hover:bg-blush-100 md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d={menuOpen ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
                stroke="#5a1f36"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* قائمة الموبايل */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="border-t border-blush-200 bg-cream md:hidden"
      >
        <ul className="mx-auto max-w-6xl px-4 py-3">
          {[...links, { to: "/wishlist", label: "Wishlist" }, accountLink, { to: "/help", label: "Help" }].map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-3 font-display text-xl transition-colors ${
                    isActive ? "bg-blush-100 text-rose" : "hover:bg-blush-50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
