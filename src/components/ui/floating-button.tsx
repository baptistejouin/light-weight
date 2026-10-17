import { PlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

interface FloatingButtonProps {
  onClick: () => void;
  children: string;
}

export function FloatingButton(props: FloatingButtonProps) {
  return (
    <div class="pointer-events-none sticky bottom-[calc(var(--spacing-nav)+1rem+env(safe-area-inset-bottom))] mt-auto flex justify-center">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        class="pointer-events-auto shadow-lg"
        onClick={props.onClick}
      >
        <PlusIcon class="text-2xl" />
        {props.children}
      </Button>
    </div>
  );
}
