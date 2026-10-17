import { createAsync, useAction } from "@solidjs/router";
import { Suspense } from "solid-js";
import { getUser, logout } from "@/api";
import { Avatar } from "@/components/ui/avatar";
import { Menu } from "@/components/ui/menu";

export function AccountMenu() {
  const user = createAsync(() => getUser());
  const doLogout = useAction(logout);

  return (
    <Menu
      placement="bottom-start"
      items={[{ label: "Logout", onSelect: () => doLogout() }]}
      trigger={(props) => (
        <button {...props} aria-label="Account menu" class="cursor-pointer">
          <Suspense fallback={<Avatar />}>
            <Avatar name={user()?.username} />
          </Suspense>
        </button>
      )}
    />
  );
}
