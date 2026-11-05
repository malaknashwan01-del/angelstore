# AngelStore 🌸

A makeup & skin care store built with React and TypeScript, with a virtual try-on and a skin quiz that builds a personal routine.

**Live demo:** _add your Vercel link here_

![AngelStore home page](docs/home.png)

## Features

- **Virtual try-on**: preview lipstick, gloss and blush shades on a model with 5 skin tones, combine lip + cheek products and add the whole look to the bag
- **Skin quiz**: 3 questions build a 3–6 step routine for your skin type and main concern, added to the bag in one click
- **Shop** with category filters, search and sorting, all kept in the URL so results can be shared
- **Product pages** with shade picker, quantity, wishlist and related products
- **Bag** saved across visits, with a free-shipping progress bar
- **Checkout** with real-time validation and an order confirmation page
- **Wishlist**, **Help center** (shipping, returns, FAQ, contact) and a newsletter signup
- Responsive down to 360px, with a collapsible mobile menu
- Accessible: keyboard focus styles, skip link, labelled controls, `aria-pressed` / `aria-expanded` states, reduced-motion support
- Per-page titles and meta tags for SEO
- Real product photos are picked up automatically from `src/assets/products`; products without a photo show an SVG illustration

## Tech stack

| Area | Choice | Why |
|------|--------|-----|
| UI | React 19 + TypeScript | Typed props and data models catch mistakes early |
| Build | Vite | Fast dev server; `import.meta.glob` finds product photos at build time |
| Styling | Tailwind CSS v4 | Brand colors defined once as theme tokens (`blush`, `rose`, `petal`...) |
| Routing | React Router | Filters live in the URL with `useSearchParams` |
| State | Zustand + `persist` | Small global stores for bag and wishlist, saved to localStorage |
| Tests | Vitest + Testing Library | Tests check behavior the way a user sees it |
| CI | GitHub Actions | Lint, type check, tests and build on every push |

## Project structure

```
src/
├── components/   Reusable UI (Navbar, ProductCard, ProductImage, FaceModel...)
├── pages/        One file per route, with its tests next to it
├── store/        Zustand stores: cart and wishlist
├── data/         Product catalog, quiz rules, try-on config, photo loader
├── lib/          Helpers: price formatting, checkout validation, page titles
├── test/         Test setup and render helper
└── types.ts      Shared types (Product, CartItem...)
```

## Getting started

```bash
npm install
npm run dev        # start the dev server
npm test           # run the test suite
npm run typecheck  # TypeScript check
npm run lint       # lint
npm run build      # production build
```

## Notes

- Product data is a local catalog, so the store works without any backend. The data layer is isolated in `src/data`, so it can be swapped for a real API later.
- Brands and products are fictional; this is a portfolio project.
