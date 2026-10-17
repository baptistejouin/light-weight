import type { z } from "zod";

// Validate a FormData (or plain object) against a schema, returning an Error
// instead of throwing so server actions can hand it back to the form.
export function parseForm<T extends z.ZodType>(
  schema: T,
  input: FormData | Record<string, unknown>,
): z.infer<T> | Error {
  const value =
    input instanceof FormData ? Object.fromEntries(input.entries()) : input;
  const { data, error } = schema.safeParse(value);
  return error ? new Error(error.message) : data;
}
