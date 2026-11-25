"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { Popover } from "@base-ui/react/popover";
import { Menu } from "@base-ui/react/menu";
import { Bell, ChevronDown, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/avatar";
import { logoutAction } from "@/app/login/_lib/login.action";
import { markReadAction } from "@/lib/notification.action";
import { cn } from "@/lib/utils";

type Notification = { id: string; message: string; read: boolean };

export function HeaderMenus({
  name,
  notifications,
}: {
  name: string;
  notifications: Notification[];
}) {
  const [items, markRead] = useOptimistic(notifications, (current, id: string) =>
    current.map((item) => (item.id === id ? { ...item, read: true } : item)),
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const unread = items.filter((item) => !item.read).length;

  function read(id: string) {
    startTransition(async () => {
      markRead(id);
      setError("");

      try {
        await markReadAction(id);
      } catch {
        setError("Unable to update notification. Try again.");
      }
    });
  }

  return (
    <div className="flex items-center gap-4 md:gap-8">
      <Popover.Root>
        <Popover.Trigger
          render={<Button variant="ghost" size="icon" aria-label="Notifications" />}
          className="relative"
        >
          <Bell className="size-6" />
          {unread ? (
            <span className="absolute -top-1 -right-1 rounded-full bg-red-600 px-1.5 text-xs text-white">
              {unread}
            </span>
          ) : null}
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={8} align="end" className="z-50">
            <Popover.Popup className="max-h-[70dvh] w-96 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border bg-card p-3 shadow-lg">
              <Popover.Title className="sr-only">Notifications</Popover.Title>
              {error ? (
                <p role="alert" className="p-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
              {items.length ? (
                items.map((item) => (
                  <button
                    key={item.id}
                    disabled={pending}
                    onClick={() => {
                      if (!item.read) read(item.id);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 border-b p-3 text-left text-sm hover:bg-muted",
                      item.read && "text-muted-foreground",
                    )}
                  >
                    {!item.read ? (
                      <span className="size-2 shrink-0 rounded-full bg-gray-800" />
                    ) : null}
                    {item.message}
                  </button>
                ))
              ) : (
                <p className="p-3 text-sm">No notifications found.</p>
              )}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
      <span className="hidden text-lg sm:block">{name}</span>
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
          <Avatar name={name} className="size-10 text-sm" />
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
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
}
