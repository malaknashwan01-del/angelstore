import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, beforeEach } from "vitest";
import { useCartStore } from "../store/cartStore";
import { resetDb, server } from "./mockApi";

beforeAll(() => server.listen());
afterAll(() => server.close());

// كل اختبار بيبدأ بسلة فاضية وبيانات API نظيفة
beforeEach(() => {
  localStorage.clear();
  useCartStore.setState({ items: [] });
  resetDb();
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});
