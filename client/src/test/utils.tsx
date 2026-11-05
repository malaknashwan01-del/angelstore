import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const STUBS = [
  { path: "/cart", label: "Cart page" },
  { path: "/login", label: "Login page" },
  { path: "/order-success", label: "Order success page" },
  { path: "/account", label: "Account page" },
];

/** بيعرض المسار الحالي — عشان نتأكد من التنقل */
function LocationProbe() {
  const location = useLocation();
  return <p data-testid="location">{location.pathname + location.search}</p>;
}

/** بيعرض كومبوننت داخل Router و React Query، زي التطبيق الحقيقي */
export function renderAt(ui: ReactElement, { route = "/", path = "*" } = {}) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={path} element={ui} />
          {/* صفحات بديلة بسيطة عشان نتأكد من التنقل — ما عدا الصفحة اللي بنختبرها */}
          {STUBS.filter((s) => s.path !== path).map((s) => (
            <Route key={s.path} path={s.path} element={<p>{s.label}</p>} />
          ))}
        </Routes>
        <LocationProbe />
      </MemoryRouter>
    </QueryClientProvider>
  );
}
