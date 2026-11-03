import type { JSX } from "solid-js";
import { PlusIcon } from "@/components/icons";

interface AddCardButtonProps {
  onClick: () => void;
  children: JSX.Element;
}

export function AddCardButton(props: AddCardButtonProps) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-primary/30 border-dashed p-4 text-black/60 transition-colors hover:border-primary/60 hover:bg-primary/5 hover:text-black"
    >
      <PlusIcon aria-hidden="true" class="text-xl" />
      {props.children}
    </button>
  );
}
