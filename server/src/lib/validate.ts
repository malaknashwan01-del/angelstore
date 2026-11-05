import type { z } from "zod";
import { HttpError } from "./errors.js";

/** بيتحقق من البيانات، وإذا غلط بيرجّع 400 مع رسالة لكل حقل */
export function parse<T extends z.ZodType>(schema: T, data: unknown): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const fields: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".") || "_";
      fields[key] ??= issue.message;
    }
    throw new HttpError(400, "Invalid request", fields);
  }
  return result.data;
}
