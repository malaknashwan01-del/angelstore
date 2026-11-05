// صور المنتجات الحقيقية
// حط الصورة بمجلد src/assets/products باسم رقم المنتج، مثلاً: 1.jpg أو 11.webp
// Vite بيلاقيها لحاله وقت البناء، وإذا ما في صورة بتظهر الرسمة بدالها.

const files = import.meta.glob<string>("../assets/products/*.{jpg,jpeg,png,webp,avif}", {
  eager: true,
  import: "default",
});

const photos: Record<string, string> = {};
for (const [path, url] of Object.entries(files)) {
  const id = path.split("/").pop()!.split(".")[0]!;
  photos[id] = url;
}

export const getPhoto = (id: number | string): string | null => photos[String(id)] ?? null;
