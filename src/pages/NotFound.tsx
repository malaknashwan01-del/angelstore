import { Link } from "react-router-dom";
import { usePageTitle } from "../lib/usePageTitle";

export default function NotFound() {
  usePageTitle("Page not found");
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-display text-7xl text-petal">404</p>
      <h1 className="mt-4 font-display text-3xl">This page flew away</h1>
      <Link to="/" className="mt-6 inline-block text-rose hover:underline">
        ← Back home
      </Link>
    </section>
  );
}
