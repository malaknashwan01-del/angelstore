import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const columns = [
  {
    title: "Shop",
    links: [
      { to: "/shop?category=makeup", label: "Makeup" },
      { to: "/shop?category=skincare", label: "Skin Care" },
      { to: "/shop?sort=rating", label: "Top Rated" },
      { to: "/wishlist", label: "Wishlist" },
    ],
  },
  {
    title: "Discover",
    links: [
      { to: "/quiz", label: "Skin Quiz" },
      { to: "/try-on", label: "Virtual Try-On" },
      { to: "/shop?sort=price-asc", label: "Under $20" },
    ],
  },
  {
    title: "Help",
    links: [
      { to: "/help#shipping", label: "Shipping" },
      { to: "/help#returns", label: "Returns" },
      { to: "/help#faq", label: "FAQ" },
      { to: "/help#contact", label: "Contact us" },
    ],
  },
];

const socials = ["Instagram", "TikTok", "Pinterest"];
const YEAR = new Date().getFullYear();

function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "done">("idle"); // idle | error | done

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("done");
    setEmail("");
  };

  if (status === "done") {
    return (
      <p className="rounded-xl bg-white px-4 py-3 text-sm">
        ✿ You're on the list! Check your inbox for <b>10% off</b>.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex overflow-hidden rounded-full border border-blush-200 bg-white focus-within:border-rose">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === "error") setStatus("idle");
          }}
          placeholder="Your email"
          aria-label="Email address"
          aria-invalid={status === "error"}
          className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none"
        />
        <button type="submit" className="bg-rose px-5 text-sm font-medium text-white transition-colors hover:bg-rose-dark">
          Join
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-xs text-rose-dark">Please enter a valid email.</p>
      )}
    </form>
  );
}

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-blush-200 bg-blush-50">
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-x-6 gap-y-10 px-4 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        {/* عن المتجر + النشرة */}
        <div className="col-span-3 max-w-sm md:col-span-1">
          <Link to="/" aria-label="AngelStore home">
            <Logo />
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-rose-ink/70">
            Gentle skincare and soft-glam makeup for every skin type. Cruelty free, always.
          </p>
          <p className="mb-3 mt-6 text-sm font-bold">Get 10% off your first order</p>
          <Newsletter />
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="font-display text-lg">{col.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-rose-ink/70 transition-colors hover:text-rose">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-blush-200">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-rose-ink/60 md:flex-row">
          <p>© {YEAR} AngelStore. All rights reserved.</p>
          <ul className="flex gap-5">
            {socials.map((name) => (
              <li key={name}>
                <a href="#" className="transition-colors hover:text-rose">
                  {name}
                </a>
              </li>
            ))}
          </ul>
          <p>Cash on delivery · Visa · Mastercard</p>
        </div>
      </div>
    </footer>
  );
}
