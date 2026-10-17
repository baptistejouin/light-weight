import { Show } from "solid-js";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  onNew?: () => void;
  class?: string;
}

export function PageHeader(props: PageHeaderProps) {
  return (
    <div class={cn("flex items-center justify-between", props.class)}>
      <h2 class="font-bold text-5xl">{props.title}</h2>
      <Show when={props.onNew}>
        {(onNew) => (
          <Button type="button" onClick={() => onNew()()}>
            New
          </Button>
        )}
      </Show>
    </div>
  );
}
