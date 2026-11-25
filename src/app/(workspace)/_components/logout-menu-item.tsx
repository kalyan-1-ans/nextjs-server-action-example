"use client";

import { useTransition } from "react";
import { Menu } from "@base-ui/react/menu";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/login/_lib/login.action";

export function LogoutMenuItem() {
  const [pending, startTransition] = useTransition();

  return (
    <Menu.Item
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await logoutAction();
        })
      }
      className="flex cursor-pointer items-center gap-2 rounded p-3 text-sm outline-none data-highlighted:bg-muted"
    >
      <LogOut className="size-4" />
      Logout
    </Menu.Item>
  );
}
