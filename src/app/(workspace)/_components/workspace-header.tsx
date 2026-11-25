import { Suspense } from "react";
import { requireUser } from "@/lib/access";
import { getNotificationsForUser } from "@/server/services/notification.service";
import { Logo } from "@/components/logo";
import { Avatar } from "@/components/avatar";
import { NotificationMenu } from "./notification-menu";
import { ProfileMenu } from "./profile-menu";

export function WorkspaceHeader() {
  return (
    <header className="flex h-28 items-center justify-between gap-4 border-b bg-card px-4 md:pr-12">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <Logo />
        <span className="max-w-36 rounded-full border border-blue-300 bg-blue-100 px-3 py-1.5 text-xs leading-tight font-semibold text-blue-900 sm:max-w-none sm:text-sm">
          Server Components Version
        </span>
      </div>
      <div className="flex items-center gap-4 md:gap-8">
        <Suspense fallback={<NotificationSkeleton />}>
          <WorkspaceNotifications />
        </Suspense>
        <Suspense fallback={<AccountSkeleton />}>
          <WorkspaceAccount />
        </Suspense>
      </div>
    </header>
  );
}

async function WorkspaceNotifications() {
  const user = await requireUser();
  const notifications = await getNotificationsForUser(user.id);

  return <NotificationMenu notifications={notifications} />;
}

async function WorkspaceAccount() {
  const user = await requireUser();

  return (
    <>
      <span className="hidden text-lg sm:block">{user.name}</span>
      <ProfileMenu>
        <Avatar name={user.name} className="size-10 text-sm" />
      </ProfileMenu>
    </>
  );
}

function NotificationSkeleton() {
  return (
    <span
      aria-busy="true"
      aria-label="Loading notifications"
      className="size-10 rounded-lg bg-gray-200 motion-safe:animate-pulse"
    />
  );
}

function AccountSkeleton() {
  return (
    <>
      <span
        aria-busy="true"
        aria-label="Loading account name"
        className="hidden h-6 w-24 rounded bg-gray-200 motion-safe:animate-pulse sm:block"
      />
      <span
        aria-busy="true"
        aria-label="Loading account menu"
        className="h-10 w-16 rounded-full bg-gray-200 motion-safe:animate-pulse"
      />
    </>
  );
}
