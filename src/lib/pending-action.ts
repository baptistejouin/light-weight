import { createSignal } from "solid-js";

// The action may return an Error to report it without throwing
export function createPendingAction<Args extends unknown[]>(
  action: (...args: Args) => Promise<unknown> | unknown,
  onSuccess: () => void,
) {
  const [error, setError] = createSignal<Error | null>(null);
  const [pending, setPending] = createSignal(false);

  async function run(...args: Args) {
    setPending(true);
    try {
      const result = await action(...args);
      if (result instanceof Error) {
        setError(result);
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return;
    } finally {
      setPending(false);
    }

    onSuccess();
  }

  return { error, pending, run, reset: () => setError(null) };
}
