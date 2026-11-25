import { requireUser } from "@/lib/access";
import { ProfileForm } from "./_components/profile-form";

export const metadata = { title: "Profile" };

export default async function Profile() {
  const user = await requireUser();

  return (
    <section className="mx-auto mt-8 w-full max-w-sm px-4">
      <h1 className="mb-8 text-xl font-semibold">Profile</h1>
      <ProfileForm name={user.name} email={user.email} />
    </section>
  );
}
