import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useMe } from "../hooks/useAuth";
import { Spinner } from "./States";

/** بيحمي الصفحة: الزائر بيروح لتسجيل الدخول، وغير الأدمن ما بيشوف صفحات الأدمن */
export default function RequireAuth({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const { data: user, isPending } = useMe();
  const location = useLocation();

  if (isPending) return <Spinner />;
  if (!user) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }
  if (admin && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
