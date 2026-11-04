import { useLocation } from "@solidjs/router";
import type { Component, JSX } from "solid-js";
import { CirclePlusIcon, HomeIcon, LibraryIcon } from "@/components/icons";
import { NewRecordMenu } from "@/components/new-record/new-record-menu";
import { cn } from "@/lib/utils";

const navItemClass = (active: boolean) =>
  cn(
    "flex h-nav w-full cursor-pointer flex-col items-center justify-center gap-0.5 text-xs transition-colors",
    active ? "font-semibold text-primary" : "text-gray-400 hover:text-gray-600",
  );

interface NavLinkProps {
  href: string;
  label: string;
  icon: Component<JSX.IntrinsicElements["svg"]>;
}

function NavLink(props: NavLinkProps) {
  const location = useLocation();
  const isActive = () => props.href === location.pathname;

  return (
    <li class="flex-1">
      <a
        href={props.href}
        aria-current={isActive() ? "page" : undefined}
        class={navItemClass(isActive())}
      >
        <props.icon aria-hidden="true" class="size-5" />
        {props.label}
      </a>
    </li>
  );
}

export default function Navigation() {
  return (
    <nav class="sticky bottom-0 -mx-4 mt-auto border-primary/10 border-t bg-white pb-[env(safe-area-inset-bottom)]">
      <ul class="flex">
        <NavLink href="/" label="Home" icon={HomeIcon} />
        <li class="flex-1">
          <NewRecordMenu
            placement="top-center"
            trigger={(props) => (
              <button {...props} class={navItemClass(props["aria-expanded"])}>
                <CirclePlusIcon aria-hidden="true" class="size-5" />
                Log
              </button>
            )}
          />
        </li>
        <NavLink href="/library" label="Library" icon={LibraryIcon} />
      </ul>
    </nav>
  );
}
