import Link from "next/link";
import { Menu } from "@base-ui/react/menu";
import { ChevronDown, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoutMenuItem } from "./logout-menu-item";

export function ProfileMenu({ children }: { children: React.ReactNode }) {
  return (
    <Menu.Root>
      <Menu.Trigger
        render={
          <Button
            variant="ghost"
            className="h-auto rounded-full px-1 py-0.5"
            aria-label="Open profile menu"
          />
        }
      >
        {children}
        <ChevronDown className="size-3" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="end" className="z-50">
          <Menu.Popup className="min-w-40 rounded-lg border bg-card p-1 shadow-lg">
            <Menu.Item
              render={<Link href="/profile" />}
              className="flex cursor-pointer items-center gap-2 rounded p-3 text-sm outline-none data-highlighted:bg-muted"
            >
              <UserCircle className="size-4" />
              Profile
            </Menu.Item>
            <LogoutMenuItem />
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
