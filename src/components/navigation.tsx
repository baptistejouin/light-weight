import { useLocation } from "@solidjs/router";
import type { JSX } from "solid-js/jsx-runtime";
import { cn } from "~/lib/utils";

interface NavigationItemProps {
  href: string;
  children: JSX.Element;
}

function NavigationItem({ href, children }: NavigationItemProps) {
  const location = useLocation();
  const isActive = () => href === location.pathname;
  return (
    <li>
      <a href={href} class={cn("text-primary", { underline: isActive() })}>
        {children}
      </a>
    </li>
  );
}

export default function Navigation() {
  return (
    <nav class="my-4 text-primary">
      <ul class="flex gap-2">
        <NavigationItem href="/">Home</NavigationItem>
        <NavigationItem href="/history">History</NavigationItem>
      </ul>
    </nav>
  );
}
