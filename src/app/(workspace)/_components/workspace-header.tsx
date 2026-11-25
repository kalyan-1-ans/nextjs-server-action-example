import { requireUser } from "@/lib/access";
import { getNotificationsForUser } from "@/server/services/notification.service";
import { Logo } from "@/components/logo";
import { HeaderMenus } from "@/components/header-menus";

export async function WorkspaceHeader() {
  const user = await requireUser();
  const notifications = await getNotificationsForUser(user.id);

  return (
    <header className="flex h-28 items-center justify-between gap-4 border-b bg-card px-4 md:pr-12">
      <Logo />
      <HeaderMenus name={user.name} notifications={notifications} />
    </header>
  );
}

export function WorkspaceHeaderSkeleton() {
  return (
    <header className="flex h-28 items-center justify-between gap-4 border-b bg-card px-4 md:pr-12">
      <Logo />
      <div
        aria-busy="true"
        aria-label="Loading account menu"
        className="h-10 w-40 rounded-lg bg-gray-200 motion-safe:animate-pulse"
      />
    </header>
  );
}
