import { splitProps, type JSX } from "solid-js";

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  defaultValue?: string | number;
  children?: JSX.Element;
}
export function Input(props: InputProps) {
  const [local, rest] = splitProps(props, ["children", "name", "defaultValue"]);
  return (
    <div class="flex flex-col">
      <label for={`form-${local.name}`}>{local.name}</label>
      <input
        id={`form-${local.name}`}
        name={local.name}
        // TODO: add class merge
        class="p-1 border border-blue-400 h-8 outline-none focus-within:bg-blue-50 focus-within:border-blue-500 transition-all"
        value={local.defaultValue || ""}
        {...rest}
      />
    </div>
  );
}
