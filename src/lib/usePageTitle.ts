import { useEffect } from "react";

const SITE = "AngelStore";

/** بيغيّر عنوان التبويب لكل صفحة — مهم للـ SEO ولقارئات الشاشة */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE}` : `${SITE} · Makeup & Skin Care`;
  }, [title]);
}
