import { AccountMenu } from "@/components/account-menu";
import { PlusIcon } from "@/components/icons";
import { NewRecordMenu } from "@/components/new-record/new-record-menu";

export default function AppHeader() {
  return (
    <header class="mb-4 flex items-center justify-between">
      <AccountMenu />
      <NewRecordMenu
        placement="bottom-end"
        trigger={(props) => (
          <button
            {...props}
            aria-label="New record"
            class="flex size-10 cursor-pointer items-center justify-center rounded-full border border-primary text-2xl text-primary"
          >
            <PlusIcon />
          </button>
        )}
      />
    </header>
  );
}
