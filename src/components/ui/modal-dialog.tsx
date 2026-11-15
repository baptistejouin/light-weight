import { splitProps } from "solid-js";
import { type DialogProps, DialogRoot } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ModalDialog(props: DialogProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <DialogRoot
      {...rest}
      class={cn(
        "m-auto w-full max-w-sm rounded-2xl p-0 shadow-xl",
        "backdrop:bg-black/40 backdrop:backdrop-blur-sm",
        "open:fade-in open:slide-in-from-bottom-4 open:animate-in",
        "backdrop:fade-in backdrop:animate-in",
        "data-closing:fade-out data-closing:slide-out-to-bottom-4 data-closing:pointer-events-none data-closing:animate-out data-closing:fill-mode-forwards",
        "data-closing:backdrop:fade-out data-closing:backdrop:animate-out data-closing:backdrop:fill-mode-forwards",
        local.class,
      )}
    />
  );
}
