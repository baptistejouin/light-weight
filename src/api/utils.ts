import type { z } from "zod";

export function parseForm<T extends z.ZodType>(
  schema: T,
  input: FormData | Record<string, unknown>,
): z.infer<T> | Error {
  const value =
    input instanceof FormData ? Object.fromEntries(input.entries()) : input;
  const { data, error } = schema.safeParse(value);
  return error ? new Error(error.message) : data;
}
