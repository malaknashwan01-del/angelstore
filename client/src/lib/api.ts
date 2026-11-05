/** خطأ من السيرفر — فيه رسالة عامة ورسالة لكل حقل إذا موجودة */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields: Record<string, string> = {}
  ) {
    super(message);
  }
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function api<T>(path: string, { method = "GET", body }: { method?: Method; body?: unknown } = {}): Promise<T> {
  let res: Response;
  try {
    // رابط كامل على نفس الدومين — بالتطوير Vite بيحوّله للسيرفر، وبالنشر Vercel
    res = await fetch(new URL(`/api${path}`, window.location.origin), {
      method,
      credentials: "include",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error ?? "Something went wrong", data.fields ?? {});
  return data as T;
}
