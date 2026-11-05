import { createSignal } from "solid-js";

interface FieldValueProps<T> {
  value?: T;
  defaultValue?: T;
  onChange?(value: T): void;
}

export function createFieldValue<T>(props: FieldValueProps<T>, fallback: T) {
  const [internal, setInternal] = createSignal<T>(
    props.defaultValue ?? fallback,
  );

  const value = () => props.value ?? internal();

  function setValue(next: T) {
    setInternal(() => next);
    props.onChange?.(next);
  }

  const reset = () => setInternal(() => props.defaultValue ?? fallback);

  return { value, setValue, reset };
}
