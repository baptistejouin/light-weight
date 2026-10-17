import { AccountMenu } from "@/components/account-menu";
import { PlusIcon } from "@/components/icons";
import { NewRecordMenu } from "@/components/new-record/new-record-menu";
import { Button } from "@/components/ui/button";

export default function AppHeader() {
  return (
    <header class="mb-4 flex items-center justify-between">
      <AccountMenu />
      <NewRecordMenu
        placement="bottom-end"
        trigger={(props) => (
          <Button
            {...props}
            aria-label="Log record"
            variant="secondary"
            size="sm"
          >
            <PlusIcon class="text-2xl" />
            Log
          </Button>
        )}
      />
    </header>
  );
}
