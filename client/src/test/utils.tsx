import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

/** بيعرض كومبوننت داخل Router، بنفس طريقة التطبيق الحقيقي */
export function renderAt(ui: ReactElement, { route = "/", path = "*" } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={ui} />
        <Route path="/cart" element={<p>Cart page</p>} />
      </Routes>
    </MemoryRouter>
  );
}
