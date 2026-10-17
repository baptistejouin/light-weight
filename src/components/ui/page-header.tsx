import { Show } from "solid-js";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  // Shows a "New" button when provided
  onNew?: () => void;
}

export function PageHeader(props: PageHeaderProps) {
  return (
    <div class="flex items-center justify-between">
      <h2 class="font-bold text-2xl">{props.title}</h2>
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
