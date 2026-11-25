"use client";

import Link from "next/link";
import { ActionForm } from "@/components/action-form";
import { profileSchema } from "@/lib/schemas";
import { updateProfileAction } from "../_lib/profile.action";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  return (
    <ActionForm
      action={updateProfileAction}
      defaults={{ name, email }}
      schema={profileSchema}
      fields={[
        { name: "name", label: "Your Name", wide: true },
        { name: "email", label: "Your Email", type: "email", disabled: true, wide: true },
      ]}
      submitLabel="Save"
    >
      <Link
        href="/dashboard"
        className="rounded-lg border border-gray-600 px-5 py-2.5 text-sm font-semibold hover:bg-gray-100"
      >
        Cancel
      </Link>
    </ActionForm>
  );
}
