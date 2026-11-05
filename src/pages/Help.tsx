import { useState, type ReactNode } from "react";
import { FREE_SHIPPING_FROM, SHIPPING_COST } from "../lib/format";
import { usePageTitle } from "../lib/usePageTitle";

const FAQ = [
  {
    q: "Are your products cruelty free?",
    a: "Yes. Every product we sell is cruelty free and never tested on animals.",
  },
  {
    q: "How do I find my foundation shade?",
    a: "Use the shade swatches on each product page, or try our Virtual Try-On to compare shades on different skin tones.",
  },
  {
    q: "Which skincare is right for me?",
    a: "Take our 1-minute Skin Quiz. It builds a routine for your skin type and main concern.",
  },
  {
    q: "Can I change my order after placing it?",
    a: "Contact us within 2 hours of ordering and we'll do our best to update it before it ships.",
  },
];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-blush-200 py-10">
      <h2 className="font-display text-3xl">{title}</h2>
      <div className="mt-4 space-y-3 leading-relaxed text-rose-ink/80">{children}</div>
    </section>
  );
}

export default function Help() {
  usePageTitle("Help center");
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-4xl sm:text-5xl">Help center</h1>
      <p className="mt-3 text-rose-ink/70">Everything about orders, delivery and returns.</p>

      <div className="mt-10">
        <Section id="shipping" title="Shipping">
          <p>
            Orders over <b>${FREE_SHIPPING_FROM}</b> ship free. Below that, shipping is a flat <b>${SHIPPING_COST}</b>.
          </p>
          <p>Orders are packed within 1 business day and arrive in 2–5 business days.</p>
        </Section>

        <Section id="returns" title="Returns">
          <p>Changed your mind? Return unopened items within <b>30 days</b> for a full refund.</p>
          <p>If a product irritates your skin, contact us and we'll help, even if it's opened.</p>
        </Section>

        <Section id="faq" title="FAQ">
          <div className="space-y-3">
            {FAQ.map((item) => (
              <details key={item.q} className="group rounded-card border border-blush-200 bg-white px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {item.q}
                  <span className="text-xl text-rose transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-rose-ink/70">{item.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section id="contact" title="Contact us">
          <p>Email us at <b>hello@angelstore.com</b>. We reply within 24 hours.</p>
          {sent ? (
            <p className="rounded-xl bg-blush-100 p-4">✿ Thanks! Your message has been sent.</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="grid gap-3"
            >
              <input required placeholder="Your email" type="email" aria-label="Your email"
                className="rounded-xl border border-blush-200 bg-white px-4 py-3 outline-none focus:border-rose" />
              <textarea required placeholder="How can we help?" rows={4} aria-label="Message"
                className="rounded-xl border border-blush-200 bg-white px-4 py-3 outline-none focus:border-rose" />
              <button className="justify-self-start rounded-full bg-rose px-8 py-3 font-medium text-white hover:bg-rose-dark">
                Send message
              </button>
            </form>
          )}
        </Section>
      </div>
    </div>
  );
}
