import { PlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";

interface LibraryToolbarProps {
  searchLabel: string;
  query: string;
  onQueryChange: (value: string) => void;
  addLabel: string;
  onAdd: () => void;
}

export function LibraryToolbar(props: LibraryToolbarProps) {
  return (
    <div class="flex items-center gap-2">
      <SearchField
        label={props.searchLabel}
        placeholder={props.searchLabel}
        value={props.query}
        onValueChange={props.onQueryChange}
      />
      <Button
        type="button"
        size="icon"
        aria-label={props.addLabel}
        onClick={props.onAdd}
      >
        <PlusIcon class="size-5" />
      </Button>
    </div>
  );
}
