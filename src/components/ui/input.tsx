import { type JSX, splitProps } from "solid-js";
import { cn } from "@/lib/utils";

export const fieldLabelClass = "px-1 font-medium text-gray-500 text-sm";

export const fieldSurfaceClass =
  "h-10 rounded-lg bg-gray-100 px-3 outline-none ring-gray-300 transition-shadow placeholder:text-gray-400 focus-visible:ring-2";

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  defaultValue?: string | number;
  hideLabel?: boolean;
  children?: JSX.Element;
}
export function Input(props: InputProps) {
  const [local, rest] = splitProps(props, [
    "children",
    "name",
    "label",
    "defaultValue",
    "hideLabel",
    "class",
  ]);
  return (
    <div class="flex flex-col gap-1.5">
      <label
        for={`form-${local.name}`}
        class={cn(fieldLabelClass, local.hideLabel && "sr-only")}
      >
        {local.label}
      </label>
      <input
        id={`form-${local.name}`}
        name={local.name}
        class={cn("m-0", fieldSurfaceClass, local.class)}
        value={local.defaultValue || ""}
        {...rest}
      />
    </div>
  );
}
