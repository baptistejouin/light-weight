import { createSignal } from "solid-js";
import { tryCatchAsync } from "@/lib/try-catch";

// The action may return an Error to report it without throwing
export function createPendingAction<Args extends unknown[]>(
  action: (...args: Args) => unknown,
  onSuccess: () => void,
) {
  const [error, setError] = createSignal<Error | null>(null);
  const [pending, setPending] = createSignal(false);

  async function run(...args: Args) {
    setPending(true);
    const { data: result, error: caught } = await tryCatchAsync<
      unknown,
      unknown
    >(async () => action(...args));
    setPending(false);

    if (caught) {
      if (caught instanceof Error) {
        setError(caught);
      } else {
        setError(new Error(String(caught)));
      }
      return;
    }
    if (result instanceof Error) {
      setError(result);
      return;
    }

    onSuccess();
  }

  return { error, pending, run, reset: () => setError(null) };
}
