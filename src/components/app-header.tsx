import { AccountMenu } from "@/components/account-menu";

export default function AppHeader() {
  return (
    <header class="mb-4 flex items-center justify-between">
      <AccountMenu />
    </header>
  );
}
